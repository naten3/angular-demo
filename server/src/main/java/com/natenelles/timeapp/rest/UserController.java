package com.natenelles.timeapp.rest;

import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.model.BooleanWrapper;
import com.natenelles.timeapp.model.UserCreateRequest;
import com.natenelles.timeapp.model.UserResponse;
import com.natenelles.timeapp.security.CustomSpringUser;
import com.natenelles.timeapp.service.intf.UserService;
import com.natenelles.timeapp.exception.UnauthorizedException;
import com.natenelles.timeapp.model.UserUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class UserController {
  @Autowired
  UserService userService;

  @GetMapping("/user/me")
  public UserResponse getUser(@AuthenticationPrincipal CustomSpringUser user) throws ResourceNotFoundException {
    return userService.getUser(user.getId()).orElseThrow(ResourceNotFoundException::new);
  }

  @GetMapping("/session-health")
  public void checkLogin(@AuthenticationPrincipal User user){}

  @GetMapping("users/available")
  BooleanWrapper isUserInfoAvailable(@RequestParam(value="username", required=false) String username,
                                     @RequestParam(value="email", required=false) String email) {
    boolean usernameAvailable = username == null ? true : userService.isUsernameAvailable(username);
    boolean passwordAvailable = email == null ? true : userService.isEmailAvailable(email);
    return new BooleanWrapper( usernameAvailable && passwordAvailable );
  }

  @GetMapping("/admin/users")
  public Page<UserResponse> getAllNonadminUsers(@AuthenticationPrincipal CustomSpringUser user, Pageable pageable) throws UnauthorizedException{
    Set<String> authorities = user.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toSet());
    if (!authorities.contains(UserRole.ADMIN) && !authorities.contains(UserRole.USER_ADMIN)) {
      throw new UnauthorizedException();
    }
    return userService.getAllNonadminUsers(pageable);
  }

  @PostMapping("/users")
  public UserResponse createUser(
                                 @RequestBody UserCreateRequest userCreateRequest) {
    return userService.createUser(userCreateRequest);
  }

  @PutMapping("/users/{id}")
  public UserResponse updateUser(@AuthenticationPrincipal CustomSpringUser principal, @PathVariable long id,
                                 @RequestBody UserUpdateRequest userUpdateRequest)
  throws UnauthorizedException, ResourceNotFoundException{
    Set<String> authorities = principal.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.toSet());
    if (!authorities.contains(UserRole.ADMIN) && !authorities.contains(UserRole.USER_ADMIN)) {
      throw new UnauthorizedException();
    }
    return userService.updateUser(id, userUpdateRequest);
  }

  @DeleteMapping("/users/{id}")
  public void deleteMeal(@AuthenticationPrincipal CustomSpringUser principal,
                         @PathVariable long id)
  throws UnauthorizedException, ResourceNotFoundException{
    UserResponse user = userService.getUser(id).orElseThrow(ResourceNotFoundException::new);
    if ((principal).getId() != user.getId() && !principal.hasAuthority(UserRole.USER_ADMIN)) {
      throw new UnauthorizedException();
    }
    userService.deleteUser(id);
  }

}
