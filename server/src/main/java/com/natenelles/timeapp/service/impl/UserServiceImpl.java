package com.natenelles.timeapp.service.impl;

import com.amazonaws.services.kms.model.NotFoundException;
import com.google.common.collect.ImmutableSet;
import com.natenelles.timeapp.config.social.SocialConnectionSignup;
import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.entity.UserInvite;
import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.model.errors.UpdatePasswordError;
import com.natenelles.timeapp.model.errors.UserInviteError;
import com.natenelles.timeapp.model.users.ImageUploadResponse;
import com.natenelles.timeapp.model.users.UserCreateRequest;
import com.natenelles.timeapp.model.users.UserResponse;
import com.natenelles.timeapp.model.users.UserUpdateRequest;
import com.natenelles.timeapp.model.errors.UserSaveError;
import com.natenelles.timeapp.model.users.SignupInvite;
import com.natenelles.timeapp.repository.TimeZoneRepository;
import com.natenelles.timeapp.repository.UserInviteRepository;
import com.natenelles.timeapp.repository.UserRepository;
import com.natenelles.timeapp.service.intf.EmailService;
import com.natenelles.timeapp.service.intf.FileUploadService;
import com.natenelles.timeapp.service.intf.SessionService;
import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.natenelles.timeapp.util.StreamUtils.optStream;

@Transactional
@Service
public class UserServiceImpl implements UserService {
  public static final String invalidFacebookRegex = String.format( "^%s.*", SocialConnectionSignup.FACEBOOK_NAME_PREFIX);
  public static final String invalidGoogleRegex = String.format( "^%s.*", SocialConnectionSignup.GOOGLE_NAME_PREFIX);

  private UserRepository userRepository;
  private TimeZoneRepository timeZoneRepository;
  private EmailService emailService;
  private FileUploadService fileUploadService;
  private UserInviteRepository userInviteRepository;
  private PasswordEncoder passwordEncoder;
  private SessionService sessionService;

  @Value("${default-profile-url}")
  private String defaultProfileUrl;

  @Value("${max-invalid-logins: 3}")
  private Integer maxInvalidLogins;

  @Autowired
  public UserServiceImpl(UserRepository userRepository,
                         TimeZoneRepository timeZoneRepository,
                         EmailService emailService,
                         FileUploadService fileUploadService,
                         UserInviteRepository userInviteRepository,
                         PasswordEncoder passwordEncoder,
                         SessionService sessionServices) {
    this.userRepository = userRepository;
    this.timeZoneRepository = timeZoneRepository;
    this.emailService = emailService;
    this.fileUploadService = fileUploadService;
    this.userInviteRepository = userInviteRepository;
    this.passwordEncoder = passwordEncoder;
    this.sessionService = sessionServices;
  }

  @Override
  public Optional<UserResponse> getUser(long id){
    return Optional.ofNullable(userRepository.findOne(id)).map(this::convertToUserResponse);
  }

  @Override
  public Optional<User> getByUsername(String username) {
    return Optional.ofNullable(userRepository.findByUsername(username));
  }

  @Override
  public Optional<User> getSecurityUser(String username){
    return userRepository.findVerifiedEmailByUsername(username);
  }

  @Override
  public Page<UserResponse> getAllUsers(final Pageable pageable) {
    return userRepository.findAll(pageable).map(this::convertToUserResponse);
  }

  @Override
  public Set<UserSaveError> createUser(final UserCreateRequest ucr) {
    if (ucr.getUsername().matches(invalidFacebookRegex) || ucr.getUsername().matches(invalidGoogleRegex)) {
      return ImmutableSet.of(UserSaveError.ILLEGAL_USERNAME);
    }

    if (!ucr.getEmail().isPresent()) {
      return ImmutableSet.of(UserSaveError.NO_EMAIL);
    }
    String email = ucr.getEmail().get();

    Optional<UserSaveError> usernameInUseError = userRepository.doesUserExist(ucr.getUsername()) ?
            Optional.of(UserSaveError.USERNAME_IN_USE)
            : Optional.empty();

    Optional<UserSaveError> emailInUseError = userRepository.findByEmail(email).isPresent() ||
            userInviteRepository.findByEmail(email).isPresent() ? Optional.of(UserSaveError.EMAIL_IN_USE) : Optional.empty();

    Set<UserSaveError> errors =
            Stream.of(optStream(usernameInUseError), optStream(emailInUseError))
                    .flatMap(Function.identity())
                    .collect(Collectors.toSet());

    if (errors.isEmpty()) {
      String emailVerificationToken = UUID.randomUUID().toString();
      User user = convertToNewUser(ucr,emailVerificationToken, email);
      User savedUser = userRepository.save(user);
      emailService.sendUserVerificationEmail(user.getEmail(), emailVerificationToken, savedUser.getId());
      return Collections.emptySet();
    } else {
      return errors;
    }
  }

  @Override
  public CreateFromInviteResult createUserFromInvite(UserCreateRequest ucr, String inviteToken) {
    Optional<UserInvite> userInvite = userInviteRepository.findByVerificationToken(inviteToken);
    if(!userInvite.isPresent()) {
      return new CreateFromInviteResult(ImmutableSet.of(UserSaveError.NO_INVITE));
    }

    if( userRepository.doesUserExist(ucr.getUsername())) {
      return new CreateFromInviteResult(ImmutableSet.of(UserSaveError.USERNAME_IN_USE));
    }

    User user = convertToNewUser(ucr, userInvite.get());
    userRepository.save(user);
    userInviteRepository.delete(userInvite.get());
    return new CreateFromInviteResult(convertToUserResponse(user));
  }

  @Override
  public UserResponse updateUser(long userId, final UserUpdateRequest uur) throws ResourceNotFoundException {
    return Optional.ofNullable(userRepository.findOne(userId))
    .map(originalUser -> {
      originalUser.setFirstName(uur.getFirstName());
      originalUser.setLastName(uur.getLastName());
      if (uur.getRole().isPresent()) {
        Set<UserRole> baseRoles = originalUser.getRoles();
        Set<UserRole> roles = baseRoles;
        String role = uur.getRole().get();
        if (role.equals(UserRole.USER_ADMIN)) {
          roles = swapRole(UserRole.USER_ADMIN, UserRole.ADMIN, baseRoles);
        } else if (role.equals(UserRole.ADMIN)) {
          roles = swapRole(UserRole.ADMIN, UserRole.USER_ADMIN, baseRoles);
        } if (role.equals(UserRole.USER)) {
          roles = baseRoles.stream().filter(r -> !r.getRoleName().equals(UserRole.ADMIN)
                  && !r.getRoleName().equals(UserRole.USER_ADMIN))
                  .collect(Collectors.toSet());
        }

        originalUser.setRoles(roles);
        if (!(new HashSet(roles).equals(new HashSet(baseRoles)))) {
          sessionService.handleChangeRoles(userId,
                  roles.stream().map(ur -> new SimpleGrantedAuthority(ur.getRoleName())).collect(Collectors.toSet()));
        }
      }
      return convertToUserResponse(userRepository.save(originalUser));
    }).orElseThrow(ResourceNotFoundException::new);
  }

  @Override
  public Set<UpdatePasswordError> updateUserPassword(long userId, String password) {
    User user = Optional.ofNullable(userRepository.getOne(userId))
            .orElseThrow(() -> new IllegalArgumentException("No user with that ID"));
    if (user.getPassword().equals(password)) {
      return ImmutableSet.of(UpdatePasswordError.SAME_PASSWORD);
    } else {
      user.setPassword(passwordEncoder.encode(password));
      userRepository.save(user);
      return Collections.emptySet();
    }
  }

  /**
   * ADMIN and USER_ADMIN are mutually exclusive so remove one if present and add one
   */
  private static Set<UserRole> swapRole(String addRole, String removeRole, Set<UserRole> roles) {
    return Stream.concat(roles.stream().filter(r -> !r.getRoleName().equals(removeRole)),
            Stream.of(new UserRole(addRole))).collect(Collectors.toSet());
  }

  @Override public void deleteUser(final long id) {
    timeZoneRepository.deleteByUserId(id);
    userRepository.delete(id);
    sessionService.handleDeleteUser(id);
  }

  @Override
  public boolean isUsernameAvailable(String username) {
    return userRepository.usernameCount(username) == 0;
  }

  @Override
  public boolean isEmailAvailable(String email) {
    return userRepository.emailCount(email) == 0;
  }

  @Override
  public boolean verifyEmail(long userId, String token) {
    Optional<User> userOpt = userRepository.findById(userId);
    if (!userOpt.isPresent()) {
      return false;
    }

    User user = userOpt.get();
    if (user.getEmailVerificationToken().equals(token) && !user.isEmailVerified()) {
      user.setEmailVerified(true);
      userRepository.save(user);
      return true;
    } else {
      return false;
    }
  }

  @Override
  public Set<UserInviteError> inviteUser(SignupInvite signupInvite) {
    if (userRepository.findByEmail(signupInvite.getEmail()).isPresent() ||
            userInviteRepository.findByEmail(signupInvite.getEmail()).isPresent()) {
      return ImmutableSet.of(UserInviteError.EMAIL_IN_USE);
    } else {
      String verificationToken = UUID.randomUUID().toString();
      UserInvite userInvite = new UserInvite();
      userInvite.setEmail(signupInvite.getEmail());
      userInvite.setVerificationToken(verificationToken);
      userInviteRepository.save(userInvite);
      emailService.sendUserInviteEmail(signupInvite.getEmail(), verificationToken);
      return Collections.emptySet();
    }
  }

  @Override
  public Optional<SignupInvite> getSignupInvite(String token) {
    return userInviteRepository.findByVerificationToken(token).map(userInvite ->
            new SignupInvite(userInvite.getEmail()));
  }

  @Override
  public ImageUploadResponse uploadProfileImage(MultipartFile file, long userId) {
    try {
      User user = Optional.ofNullable(userRepository.getOne(userId))
              .orElseThrow(() -> new IllegalArgumentException("No user with that ID"));
      String url = fileUploadService.uploadProfileImage(file).toString();
      user.setProfileImage(Optional.of(url));
      userRepository.save(user);
      return new ImageUploadResponse(url);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  @Transactional
  public void handleLoginFailure(String username) {
    Optional.ofNullable(userRepository.findByUsername(username)).ifPresent(user -> {
      if (!user.isAccountLocked()) {
        user.incrementInvalidLoginCount();
        if (user.getInvalidLoginCount() >= maxInvalidLogins) {
          user.setAccountLocked(true);
        }
        userRepository.save(user);
      }
    });
  }

  @Override
  public void resetInvalidLoginCount(long id) {
    User user = Optional.ofNullable(userRepository.findOne(id))
            .orElseThrow(() -> new IllegalArgumentException("Invalid username"));
    user.setInvalidLoginCount(0);
    userRepository.save(user);
  }

  @Override
  public void unlockUser(long id) {
    User user = Optional.ofNullable(userRepository.findOne(id))
            .orElseThrow(() -> new NotFoundException("Invalid username"));
    user.setInvalidLoginCount(0);
    user.setAccountLocked(false);
    userRepository.save(user);
  }

  private UserResponse convertToUserResponse(User user) {
    Set<String> roles = user.getRoles().stream()
            .map(UserRole::getRoleName)
            .collect(Collectors.toSet());
    return new UserResponse(user.getId(),
            user.getUsername(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(), user.getProfileImage(),
            user.getSocialProfileImage(),
            isSocialUser(user),
            user.isEmailVerified(),
            user.isAccountLocked(),
            roles);
  }

  private static boolean isSocialUser(User user) {
    return user.getFacebookId().isPresent() || user.getGoogleId().isPresent();
  }

  /**
   * Converts a new user to a User, adds USER role
   */
  private User convertToNewUser(UserCreateRequest ucr, String emailVerificationToken, String email) {
    User user = new User();
    user.setUsername(ucr.getUsername());
    user.setPassword(passwordEncoder.encode(ucr.getPassword()));
    user.setEmail(email);
    user.setFirstName(ucr.getFirstName());
    user.setLastName(ucr.getLastName());
    user.setEmailVerificationToken(emailVerificationToken);
    user.setProfileImage(Optional.of(defaultProfileUrl));

    Set<UserRole> roles = new HashSet<>();
    roles.add(new UserRole(UserRole.USER));
    user.setRoles(roles);
    return user;
  }

  private User convertToNewUser(UserCreateRequest ucr, UserInvite userInvite) {
    User user = new User();
    user.setUsername(ucr.getUsername());
    user.setPassword(passwordEncoder.encode(ucr.getPassword()));
    user.setEmail(userInvite.getEmail());
    user.setFirstName(ucr.getFirstName());
    user.setLastName(ucr.getLastName());
    user.setEmailVerified(true);
    user.setProfileImage(Optional.of(defaultProfileUrl));

    Set<UserRole> roles = new HashSet<>();
    roles.add(new UserRole(UserRole.USER));
    user.setRoles(roles);
    return user;
  }
}
