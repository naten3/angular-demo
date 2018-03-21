package com.natenelles.timeapp.service.intf;

import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.model.errors.UpdatePasswordError;
import com.natenelles.timeapp.model.errors.UserInviteError;
import com.natenelles.timeapp.model.users.ImageUploadResponse;
import com.natenelles.timeapp.model.users.UserCreateRequest;
import com.natenelles.timeapp.model.users.UserResponse;
import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.model.users.UserUpdateRequest;
import com.natenelles.timeapp.model.errors.UserSaveError;
import com.natenelles.timeapp.model.users.SignupInvite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.Set;

public interface UserService {
  Optional<UserResponse> getUser(long id);

  Optional<User> getByUsername(String username);

  Optional<User> getSecurityUser(String username);

  Page<UserResponse> getAllUsers(Pageable pageable);

  Set<UserSaveError> createUser(UserCreateRequest ucr);

  CreateFromInviteResult createUserFromInvite(UserCreateRequest ucr, String inviteToken);

  UserResponse updateUser(long userId, UserUpdateRequest uur) throws ResourceNotFoundException;

  Set<UpdatePasswordError> updateUserPassword(long userId, String password);

  boolean isUsernameAvailable(String username);

  boolean isEmailAvailable(String email);

  void deleteUser(long id);

  boolean verifyEmail(long userId, String token);

  Set<UserInviteError> inviteUser(SignupInvite signupInvite);

  Optional<SignupInvite> getSignupInvite(String token);

  ImageUploadResponse uploadProfileImage(MultipartFile file, long userId);

  class CreateFromInviteResult {
    Optional<Set<UserSaveError>> errors = Optional.empty();
    Optional<UserResponse> user = Optional.empty();

    public CreateFromInviteResult(Set<UserSaveError> errors) {
      this.errors = Optional.of(errors);
    }

    public CreateFromInviteResult(UserResponse user) {
      this.user = Optional.of(user);
    }

    public Optional<Set<UserSaveError>> getErrors() {
      return errors;
    }

    public Optional<UserResponse> getUser() {
      return user;
    }
  }
}
