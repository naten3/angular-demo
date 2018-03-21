package com.natenelles.timeapp.security;

import com.natenelles.timeapp.model.users.UserResponse;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Custom User to hold the id, since all rest endpoints use id instead of username, we don't want to have to
 * look up id by username for every endpoint
 */
public class CustomSpringUser extends User {

  private long id;

  public CustomSpringUser(final String username, final String password, final Collection<? extends GrantedAuthority> authorities, long id) {
    super(username, password, authorities);
    this.id = id;
  }

  public CustomSpringUser(final String username, final String password, final boolean enabled, final boolean accountNonExpired,
                          final boolean credentialsNonExpired, final boolean accountNonLocked,
                          final Collection<? extends GrantedAuthority> authorities, long id) {
    super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    this.id = id;
  }

  public boolean hasAuthority(String s) {
    return getAuthorities().stream().map(a -> a.getAuthority()).filter(auth -> auth.equals(s)).findFirst().isPresent();
  }

  public long getId() {
    return id;
  }

  public static CustomSpringUser fromUserResponse(UserResponse userResponse, String password) {
    Collection<? extends GrantedAuthority> authorities = userResponse.getRoles().stream()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toSet());
    return new CustomSpringUser(userResponse.getUsername(), password, true, true,
            true, true, authorities, userResponse.getId());
  }
}
