package com.natenelles.timeapp.security;

import com.google.common.collect.ImmutableSet;
import com.natenelles.timeapp.entity.UserRole;
import com.natenelles.timeapp.model.errors.UserSaveError;
import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

import static com.natenelles.timeapp.service.impl.UserServiceImpl.invalidFacebookRegex;
import static com.natenelles.timeapp.service.impl.UserServiceImpl.invalidGoogleRegex;

@Component
class CustomUserDetailService implements UserDetailsService {

  private UserService userService;

  @Autowired
  public CustomUserDetailService(final UserService userService) {
    this.userService = userService;
  }

  public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
    //todo locking?
    boolean enabled = true;
    boolean accountNonExpired = true;
    boolean credentialsNonExpired = true;
    boolean accountNonLocked = true;

    if (username.matches(invalidFacebookRegex) || username.matches(invalidGoogleRegex)) {
      return null;
    }

    return userService.getSecurityUser(username).map(user -> {
      return new CustomSpringUser
      (user.getUsername(),
      user.getPassword(), enabled, accountNonExpired,
      credentialsNonExpired, accountNonLocked, getAuthorities(user.getRoles()), user.getId());
    }).orElseThrow(() -> new UsernameNotFoundException(
    "No user found with username: " + username));
  }

  private Set<GrantedAuthority> getAuthorities (Set<UserRole> roles) {
    return roles.stream().map(r -> new SimpleGrantedAuthority(r.getRoleName())).collect(Collectors.toSet());
  }
}
