package io.abnd.service.intf;

import io.abnd.entity.User;
import io.abnd.exception.ResourceNotFoundException;
import io.abnd.model.UserCreateRequest;
import io.abnd.model.UserResponse;
import io.abnd.model.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

public interface UserService {
  public Optional<UserResponse> getUser(long id);

  public Optional<User> getSecurityUser(String username);

  public Page<UserResponse> getAllNonadminUsers(Pageable pageable);

  public UserResponse createUser(UserCreateRequest ucr);

  public UserResponse updateUser(long userId, UserUpdateRequest uur) throws ResourceNotFoundException;

  boolean isUsernameAvailable(String username);

  boolean isEmailAvailable(String email);

  void deleteUser(long id);
}
