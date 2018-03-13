package io.abnd.model;

import java.util.Optional;
import java.util.Set;

public class UserResponse {

  private Long id;
  private String username;
  private String email;
  private Set<String> roles;

  public UserResponse(final Long id, final String username, final String email, final Set<String> roles) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }

  public Long getId() {
    return id;
  }

  public void setId(final Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(final String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(final Set<String> roles) {
    this.roles = roles;
  }
}
