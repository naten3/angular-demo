package io.abnd.service.impl;

import io.abnd.entity.User;
import io.abnd.entity.UserRole;
import io.abnd.exception.ResourceNotFoundException;
import io.abnd.model.UserCreateRequest;
import io.abnd.model.UserResponse;
import io.abnd.model.UserUpdateRequest;
import io.abnd.repository.MealRepository;
import io.abnd.repository.UserRepository;
import io.abnd.service.intf.EmailService;
import io.abnd.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Transactional
@Service
public class UserServiceImpl implements UserService {
  UserRepository userRepository;
  MealRepository mealRepository;
  EmailService emailService;

  @Autowired
  public UserServiceImpl(final UserRepository userRepository, final MealRepository mealRepository, final EmailService emailService) {
    this.userRepository = userRepository;
    this.mealRepository = mealRepository;
    this.emailService = emailService;
  }

  @Override
  public Optional<UserResponse> getUser(long id){
    return Optional.ofNullable(userRepository.findOne(id)).map(this::convertToUserResponse);
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
  public UserResponse createUser(final UserCreateRequest ucr) {
    String emailVerificationToken = UUID.randomUUID().toString();

    User user = convertToUser(ucr,emailVerificationToken);
    User savedUser = userRepository.save(user);
    emailService.sendUserVerificationEmail(user.getEmail(), emailVerificationToken, savedUser.getId());
    return convertToUserResponse(savedUser);
  }

  @Override
  public UserResponse updateUser(long userId, final UserUpdateRequest uur) throws ResourceNotFoundException{
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
}
