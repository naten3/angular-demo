package com.natenelles.timeapp.service.impl;

import com.google.common.collect.ImmutableSet;
import com.natenelles.timeapp.config.social.FacebookConnectionSignup;
import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.entity.UserInvite;
import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.model.errors.UpdatePasswordError;
import com.natenelles.timeapp.model.users.ImageUploadResponse;
import com.natenelles.timeapp.model.users.UserCreateRequest;
import com.natenelles.timeapp.model.users.UserResponse;
import com.natenelles.timeapp.model.users.UserUpdateRequest;
import com.natenelles.timeapp.model.errors.UserSaveError;
import com.natenelles.timeapp.model.users.SignupInvite;
import com.natenelles.timeapp.repository.MealRepository;
import com.natenelles.timeapp.repository.UserInviteRepository;
import com.natenelles.timeapp.repository.UserRepository;
import com.natenelles.timeapp.service.intf.EmailService;
import com.natenelles.timeapp.service.intf.FileUploadService;
import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
  private static final String invalidFacebookRegex = String.format( "^%s.*",FacebookConnectionSignup.FACEBOOK_NAME_PREFIX);

  private UserRepository userRepository;
  private MealRepository mealRepository;
  private EmailService emailService;
  private FileUploadService fileUploadService;
  private UserInviteRepository userInviteRepository;

  @Value("${default-profile-url}")
  private String defaultProfileUrl;

  @Autowired
  public UserServiceImpl(UserRepository userRepository,
                         MealRepository mealRepository,
                         EmailService emailService,
                         FileUploadService fileUploadService,
                         UserInviteRepository userInviteRepository) {
    this.userRepository = userRepository;
    this.mealRepository = mealRepository;
    this.emailService = emailService;
    this.fileUploadService = fileUploadService;
    this.userInviteRepository = userInviteRepository;
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
    if (ucr.getUsername().matches(invalidFacebookRegex)) {
      return ImmutableSet.of(UserSaveError.ILLEGAL_USERNAME);
    }

    Optional<UserSaveError> usernameInUseError = userRepository.doesUserExist(ucr.getUsername()) ? Optional.of(UserSaveError.USERNAME_IN_USE)
            : Optional.empty();

    Optional<UserSaveError> emailInUseError = userRepository.findByEmail(ucr.getEmail()).isPresent() ||
            userInviteRepository.findByEmail(ucr.getEmail()).isPresent() ? Optional.of(UserSaveError.EMAIL_IN_USE) : Optional.empty();

    Set<UserSaveError> errors =
            Stream.of(optStream(usernameInUseError), optStream(emailInUseError))
                    .flatMap(Function.identity())
                    .collect(Collectors.toSet());

    if (errors.isEmpty()) {
      String emailVerificationToken = UUID.randomUUID().toString();
      User user = convertToNewUser(ucr,emailVerificationToken);
      User savedUser = userRepository.save(user);
      emailService.sendUserVerificationEmail(user.getEmail(), emailVerificationToken, savedUser.getId());
      return Collections.emptySet();
    } else {
      return errors;
    }
  }

  @Override
  public UserResponse updateUser(long userId, final UserUpdateRequest uur) throws ResourceNotFoundException {
    return Optional.ofNullable(userRepository.findOne(userId))
    .map(originalUser -> {
      originalUser.setFirstName(uur.getFirstName());
      originalUser.setLastName(uur.getLastName());
      if (uur.getRole().isPresent()) {
        Set<UserRole> baseRoles = originalUser.getRoles();
        String role = uur.getRole().get();
        if (role.equals(UserRole.USER_ADMIN)) {
          originalUser.setRoles(swapRole(UserRole.USER_ADMIN, UserRole.ADMIN, baseRoles));
        } else if (role.equals(UserRole.ADMIN)) {
          originalUser.setRoles(swapRole(UserRole.ADMIN, UserRole.USER_ADMIN, baseRoles));
        } if (role.equals(UserRole.USER)) {
          Set<UserRole> roles = baseRoles.stream().filter(r -> !r.getRoleName().equals(UserRole.ADMIN)
                  && !r.getRoleName().equals(UserRole.USER_ADMIN))
                  .collect(Collectors.toSet());
          originalUser.setRoles(roles);
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
      //TODO hash
      user.setPassword(password);
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
    mealRepository.deleteByUserId(id);
    userRepository.delete(id);
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
  public boolean inviteUser(SignupInvite signupInvite) {
    if (userRepository.findByEmail(signupInvite.getEmail()).isPresent() ||
            userInviteRepository.findByEmail(signupInvite.getEmail()).isPresent()) {
      return false;
    } else {
      String verificationToken = UUID.randomUUID().toString();
      UserInvite userInvite = new UserInvite();
      userInvite.setEmail(signupInvite.getEmail());
      userInvite.setVerificationToken(verificationToken);
      userInviteRepository.save(userInvite);
      emailService.sendUserInviteEmail(signupInvite.getEmail(), verificationToken);
      return true;
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
            roles);
  }

  private static boolean isSocialUser(User user) {
    return user.getFacebookId().isPresent();
  }

  /**
   * Converts a new user to a User, adds USER role
   */
  private User convertToNewUser(UserCreateRequest ucr, String emailVerificationToken) {
    User user = new User();
    user.setUsername(ucr.getUsername());
    user.setPassword(ucr.getPassword()); //TODO Bcrypt
    user.setEmail(ucr.getEmail());
    user.setFirstName(ucr.getFirstName());
    user.setLastName(ucr.getLastName());
    user.setEmailVerificationToken(emailVerificationToken);
    user.setProfileImage(Optional.of(defaultProfileUrl));

    Set<UserRole> roles = new HashSet<>();
    roles.add(new UserRole(UserRole.USER));
    user.setRoles(roles);
    return user;
  }
}
