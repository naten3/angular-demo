package com.natenelles.timeapp.rest;

import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.exception.UnauthorizedException;
import com.natenelles.timeapp.model.ErrorResponse;
import com.natenelles.timeapp.model.SuccessResponse;
import com.natenelles.timeapp.model.errors.UpdatePasswordError;
import com.natenelles.timeapp.model.errors.UserInviteError;
import com.natenelles.timeapp.model.errors.UserSaveError;
import com.natenelles.timeapp.model.users.ImageUploadResponse;
import com.natenelles.timeapp.model.users.SignupInvite;
import com.natenelles.timeapp.model.users.UpdatePasswordRequest;
import com.natenelles.timeapp.model.users.UserCreateRequest;
import com.natenelles.timeapp.model.users.UserResponse;
import com.natenelles.timeapp.model.users.UserUpdateRequest;
import com.natenelles.timeapp.security.CustomSpringUser;
import com.natenelles.timeapp.service.intf.SessionService;
import com.natenelles.timeapp.service.intf.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.natenelles.timeapp.entity.UserRole.ADMIN;
import static com.natenelles.timeapp.util.SecurityUtil.checkOwnerOrUserAdmin;
import static com.natenelles.timeapp.util.SecurityUtil.checkUserAdmin;

@RestController
public class UserController {
  Logger logger = LoggerFactory.getLogger(UserController.class);
  @Autowired
  UserService userService;
  @Autowired
  PasswordEncoder passwordEncoder;
  @Autowired
  SessionService sessionService;

  @GetMapping("/session-init")
  public void sessionInit() {}

  @GetMapping("/user/me")
  public UserResponse getUser(@AuthenticationPrincipal CustomSpringUser user) throws ResourceNotFoundException {
    return userService.getUser(user.getId()).orElseThrow(ResourceNotFoundException::new);
  }

  @GetMapping("/session-health")
  public void checkLogin(@AuthenticationPrincipal User user){}

  @GetMapping("/admin/users")
  public Page<UserResponse> getAllUsers(@AuthenticationPrincipal CustomSpringUser user, Pageable pageable) throws UnauthorizedException{
    checkUserAdmin(user);
    return userService.getAllUsers(pageable);
  }

  /**
   * returns a 201 for non-invited users
   * returns a 200 with user resposne for invited users
   * returns a set of errors for error
   */
  @PostMapping("/users")
  public ResponseEntity createUser(
                                 @RequestBody UserCreateRequest userCreateRequest) {
    if (!userCreateRequest.getInviteToken().isPresent()) {
      Set<UserSaveError> errors = userService.createUser(userCreateRequest);
      if (errors.isEmpty()) {
        return new ResponseEntity(HttpStatus.CREATED);
      } else {
        return new ResponseEntity(new ErrorResponse(errors), HttpStatus.BAD_REQUEST);
      }
    } else {
      UserService.CreateFromInviteResult result = userService.createUserFromInvite(userCreateRequest,
              userCreateRequest.getInviteToken().get());
      if (result.getErrors().isPresent()) {
        return new ResponseEntity(new ErrorResponse(result.getErrors().get()), HttpStatus.BAD_REQUEST);
      } else {
        UserResponse userResponse = result.getUser().get();
        String encodedPassword = passwordEncoder.encode(userCreateRequest.getPassword());
        Set<GrantedAuthority> authorities = result.getUser().get().getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r)).collect(Collectors.toSet());
        CustomSpringUser user = CustomSpringUser.fromUserResponse(userResponse, encodedPassword);
        SecurityContextHolder.getContext()
                .setAuthentication(new UsernamePasswordAuthenticationToken(user, encodedPassword, authorities));

        String authToken = RequestContextHolder.currentRequestAttributes().getSessionId();
        sessionService.handleLogin(user.getId(), authToken);
        return new ResponseEntity(userResponse, HttpStatus.OK);
      }
    }
  }

  @PutMapping("/users/{id}")
  public ResponseEntity updateUser(@AuthenticationPrincipal CustomSpringUser principal, @PathVariable long id,
                                 @RequestBody UserUpdateRequest userUpdateRequest)
  throws ResourceNotFoundException{
    Set<String> authorities = principal.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toSet());
    checkOwnerOrUserAdmin(principal, id);
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
    checkOwnerOrUserAdmin(principal, id);
    Set<UpdatePasswordError> errors = userService.updateUserPassword(id, updatePasswordRequest.getPassword());

    return new SuccessResponse<>(errors.isEmpty(), Optional.of(errors));
  }

  @GetMapping("/users/{id}")
  public UserResponse getUser(@AuthenticationPrincipal CustomSpringUser principal,
                         @PathVariable long id)
          throws UnauthorizedException, ResourceNotFoundException{
    checkOwnerOrUserAdmin(principal, id);
    return userService.getUser(id).orElseThrow(ResourceNotFoundException::new);
  }

  @DeleteMapping("/users/{id}")
  public void deleteUser(@AuthenticationPrincipal CustomSpringUser principal,
                         @PathVariable long id)
          throws UnauthorizedException, ResourceNotFoundException{
    userService.getUser(id).orElseThrow(ResourceNotFoundException::new);
    checkOwnerOrUserAdmin(principal, id);
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
  public SuccessResponse inviteUser(@AuthenticationPrincipal CustomSpringUser principal,
                                    @RequestBody SignupInvite signupInvite) {
    checkUserAdmin(principal);
    Set<UserInviteError> inviteErrors= userService.inviteUser(signupInvite);
    return new SuccessResponse(inviteErrors.isEmpty(), Optional.of(inviteErrors));
  }

  @GetMapping("/users/signup-invite")
  public ResponseEntity<SignupInvite> getUserInvite(@RequestParam(value = "invite-token") String token) {
    return userService.getSignupInvite(token).map(signupInvite -> new ResponseEntity<>(signupInvite, HttpStatus.OK))
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @PostMapping(value="/users/{id}/image/upload")
  public ImageUploadResponse handleFileUpload(
          @RequestParam("file") MultipartFile file,
          @PathVariable("id") long userId,
          @AuthenticationPrincipal CustomSpringUser principal){
    checkOwnerOrUserAdmin(principal, userId);
    try {
      return userService.uploadProfileImage(file, userId);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @GetMapping("/admin/user-unlock")
  public void unlockUser(@AuthenticationPrincipal CustomSpringUser user, @RequestParam("id") long userId)
          throws UnauthorizedException{
    checkUserAdmin(user);
    userService.unlockUser(userId);
  }

}
