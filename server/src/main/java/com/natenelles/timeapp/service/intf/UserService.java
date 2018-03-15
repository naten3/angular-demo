package com.natenelles.timeapp.service.intf;

import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.model.UserCreateRequest;
import com.natenelles.timeapp.model.UserResponse;
import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.model.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
