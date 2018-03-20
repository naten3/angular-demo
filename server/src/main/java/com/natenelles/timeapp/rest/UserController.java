package com.natenelles.timeapp.rest;

import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.exception.UnauthorizedException;
import com.natenelles.timeapp.model.SuccessResponse;
import com.natenelles.timeapp.model.errors.UpdatePasswordError;
import com.natenelles.timeapp.model.errors.UserSaveError;
import com.natenelles.timeapp.model.users.ImageUploadResponse;
import com.natenelles.timeapp.model.users.SignupInvite;
import com.natenelles.timeapp.model.users.UpdatePasswordRequest;
import com.natenelles.timeapp.model.users.UserCreateRequest;
import com.natenelles.timeapp.model.users.UserResponse;
import com.natenelles.timeapp.model.users.UserUpdateRequest;
import com.natenelles.timeapp.security.CustomSpringUser;
import com.natenelles.timeapp.service.intf.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.natenelles.timeapp.entity.UserRole.ADMIN;
import static com.natenelles.timeapp.entity.UserRole.USER_ADMIN;
import static com.natenelles.timeapp.util.SecurityUtil.checkUserOrAdmin;

@RestController
public class UserController {
  Logger logger = LoggerFactory.getLogger(UserController.class);
  @Autowired
  UserService userService;

  @GetMapping("/user/me")
  public UserResponse getUser(@AuthenticationPrincipal CustomSpringUser user) throws ResourceNotFoundException {
    return userService.getUser(user.getId()).orElseThrow(ResourceNotFoundException::new);
  }

  @GetMapping("/session-health")
  public void checkLogin(@AuthenticationPrincipal User user){}

  @GetMapping("/admin/users")
  public Page<UserResponse> getAllUsers(@AuthenticationPrincipal CustomSpringUser user, Pageable pageable) throws UnauthorizedException{
    Set<String> authorities = user.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toSet());
    if (!authorities.contains(ADMIN) && !authorities.contains(USER_ADMIN)) {
      throw new UnauthorizedException("Only admins or user admins can get all users");
    }
    return userService.getAllUsers(pageable);
  }

  @PostMapping("/users")
  public SuccessResponse<UserSaveError> createUser(
                                 @RequestBody UserCreateRequest userCreateRequest) {
    Set<UserSaveError> errors = userService.createUser(userCreateRequest);

    return new SuccessResponse<>(errors.isEmpty(), Optional.of(errors).filter(es -> !es.isEmpty()));
  }

  @PutMapping("/users/{id}")
  public ResponseEntity updateUser(@AuthenticationPrincipal CustomSpringUser principal, @PathVariable long id,
                                 @RequestBody UserUpdateRequest userUpdateRequest)
  throws ResourceNotFoundException{
    Set<String> authorities = principal.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toSet());
    checkUserOrAdmin(principal, id);
    if (userUpdateRequest.getRole().isPresent()) {
      String role = userUpdateRequest.getRole().get();
      if (!authorities.contains(ADMIN)) {
        throw new UnauthorizedException("only admins can change role assignment");
      }
    }
    return new ResponseEntity(userService.updateUser(id, userUpdateRequest), HttpStatus.OK);
  }

  @PutMapping("/users/{id}/password")
  public SuccessResponse<UpdatePasswordError> updateUserPassword(
          @AuthenticationPrincipal CustomSpringUser principal, @PathVariable long id,
                                   @RequestBody UpdatePasswordRequest updatePasswordRequest)
          throws UnauthorizedException, ResourceNotFoundException{
    Set<String> authorities = principal.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toSet());
    if (principal.getId() != id &&
            !authorities.contains(ADMIN)
            && !authorities.contains(USER_ADMIN)) {
      throw new UnauthorizedException();
    }

    Set<UpdatePasswordError> errors = userService.updateUserPassword(id, updatePasswordRequest.getPassword());

    return new SuccessResponse<>(errors.isEmpty(), Optional.of(errors));
  }

  @GetMapping("/users/{id}")
  public UserResponse getUser(@AuthenticationPrincipal CustomSpringUser principal,
                         @PathVariable long id)
          throws UnauthorizedException, ResourceNotFoundException{
    checkUserOrAdmin(principal, id);
    return userService.getUser(id).orElseThrow(ResourceNotFoundException::new);
  }

  @DeleteMapping("/users/{id}")
  public void deleteUser(@AuthenticationPrincipal CustomSpringUser principal,
                         @PathVariable long id)
          throws UnauthorizedException, ResourceNotFoundException{
    UserResponse user = userService.getUser(id).orElseThrow(ResourceNotFoundException::new);
    checkUserOrAdmin(principal, id);
    userService.deleteUser(id);
  }

  @GetMapping("/users/verify-email")
  public SuccessResponse verifyEmail(@RequestParam("userId") long userId, @RequestParam("token") String token) {
    if (userService.verifyEmail(userId, token)) {
      return new SuccessResponse(true, Optional.empty());
    } else {
      return new SuccessResponse(false, Optional.empty());
    }
  }

  @PostMapping("/users/signup-invite")
  public SuccessResponse inviteUser(SignupInvite signupInvite) {
    if (userService.inviteUser(signupInvite)) {
      return new SuccessResponse(true, Optional.empty());
    } else {
      return new SuccessResponse(false, Optional.empty());
    }
  }

  //TODO authenticate
  @GetMapping("/users/signup-invite")
  public ResponseEntity<SignupInvite> getUserInvite(@Param("token") String token) {
    return userService.getSignupInvite(token).map(signupInvite -> new ResponseEntity<>(signupInvite, HttpStatus.OK))
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @PostMapping(value="/users/{id}/image/upload")
  public ImageUploadResponse handleFileUpload(
          @RequestParam("file") MultipartFile file,
          @PathVariable("id") long userId,
          @AuthenticationPrincipal CustomSpringUser principal){
    checkUserOrAdmin(principal, userId);
    try {
      return userService.uploadProfileImage(file, userId);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
