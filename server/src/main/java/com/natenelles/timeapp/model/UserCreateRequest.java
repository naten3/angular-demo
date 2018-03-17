package com.natenelles.timeapp.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Optional;

public class UserCreateRequest {

  @NotNull
  @Size(min = 1, max = 100)
  private String username;
  @NotNull
  @Size(min = 8, max = 100)
  private String password;
  @NotNull
  @Size(max = 300)
  private String email;

  public String getUsername() {
    return username;
  }

  public void setUsername(final String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(final String password) {
    this.password = password;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(final String email) {
    this.email = email;
  }
}
