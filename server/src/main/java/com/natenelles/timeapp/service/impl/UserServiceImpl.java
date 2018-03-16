package com.natenelles.timeapp.service.impl;

import com.natenelles.timeapp.config.social.FacebookConnectionSignup;
import com.natenelles.timeapp.entity.UserInviteEntity;
import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.model.UserCreateRequest;
import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.model.UserResponse;
import com.natenelles.timeapp.model.UserUpdateRequest;
import com.natenelles.timeapp.model.errors.UserSaveError;
import com.natenelles.timeapp.model.users.SignupInvite;
import com.natenelles.timeapp.repository.MealRepository;
import com.natenelles.timeapp.repository.UserInviteRepository;
import com.natenelles.timeapp.repository.UserRepository;
import com.natenelles.timeapp.service.intf.EmailService;
import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Transactional
@Service
public class UserServiceImpl implements UserService {
  private static final String invalidFacebookRegex = String.format( "^%s.*",FacebookConnectionSignup.FACEBOOK_NAME_PREFIX);

  UserRepository userRepository;
  MealRepository mealRepository;
  EmailService emailService;
  UserInviteRepository userInviteRepository;

  @Autowired
  public UserServiceImpl(final UserRepository userRepository, final MealRepository mealRepository, final EmailService emailService,
                         final UserInviteRepository userInviteRepository) {
    this.userRepository = userRepository;
    this.mealRepository = mealRepository;
    this.emailService = emailService;
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
  public Page<UserResponse> getAllNonadminUsers(final Pageable pageable) {
    return userRepository.findAllByRole(UserRole.USER, pageable).map(this::convertToUserResponse);
  }

  @Override
  public Set<UserSaveError> createUser(final UserCreateRequest ucr) {
    if (ucr.getUsername().matches(invalidFacebookRegex)) {
      return Set.of(UserSaveError.ILLEGAL_USERNAME);
    }

    Optional<UserSaveError> usernameInUseError = userRepository.doesUserExist(ucr.getUsername()) ? Optional.of(UserSaveError.USERNAME_IN_USE)
            : Optional.empty();

    Optional<UserSaveError> emailInUseError = userRepository.findByEmail(ucr.getEmail()).isPresent() ||
            userInviteRepository.findByEmail(ucr.getEmail()).isPresent() ? Optional.of(UserSaveError.EMAIL_IN_USE) : Optional.empty();

    Set<UserSaveError> errors =
            Stream.of(usernameInUseError.stream(), emailInUseError.stream())
                    .flatMap(Function.identity())
                    .collect(Collectors.toSet());

    if (errors.isEmpty()) {
      String emailVerificationToken = UUID.randomUUID().toString();
      User user = convertToUser(ucr,emailVerificationToken);
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
      User newUser = mergeUser(originalUser, uur);
      return convertToUserResponse(userRepository.save(newUser));
    }).orElseThrow(ResourceNotFoundException::new);
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
      UserInviteEntity userInviteEntity = new UserInviteEntity();
      userInviteEntity.setEmail(signupInvite.getEmail());
      userInviteEntity.setVerificationToken(verificationToken);
      userInviteRepository.save(userInviteEntity);
      emailService.sendUserInviteEmail(signupInvite.getEmail(), verificationToken);
      return true;
    }
  }

  private UserResponse convertToUserResponse(User user) {
    Set<String> roles = user.getRoles().stream()
    .map(role -> role.getRoleName())
    .collect(Collectors.toSet());
    return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), roles);
  }

  /**
   * Converts a new user to a User, adds USER role
   */
  private User convertToUser(UserCreateRequest ucr, String emailVerificationToken) {
    User user = new User();
    user.setUsername(ucr.getUsername());
    user.setPassword(ucr.getPassword()); //TODO Bcrypt
    user.setEmail(ucr.getEmail());
    user.setEmailVerificationToken(emailVerificationToken);

    Set<UserRole> roles = new HashSet<>();
    roles.add(new UserRole(UserRole.USER));
    user.setRoles(roles);
    return user;
  }

  private User mergeUser(User user, UserUpdateRequest uur) {
    User newUser = new User();
    newUser.setId(user.getId());
    newUser.setUsername(user.getUsername());
    newUser.setPassword(user.getPassword());
    newUser.setEmail(uur.getEmail());
    newUser.setRoles(user.getRoles());
    return newUser;
  }

  @Override
  public Optional<SignupInvite> getSignupInvite(String token) {
    return userInviteRepository.findByVerificationToken(token).map(userInvite ->
            new SignupInvite(userInvite.getEmail()));
  }
}
