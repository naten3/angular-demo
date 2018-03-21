package com.natenelles.timeapp.model.users;

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
  private Optional<String> email = Optional.empty();
  @NotNull
  @Size(max = 100)
  private String firstName;
  @NotNull
  @Size(max = 100)
  private String lastName;
  @Size(max = 100)
  private Optional<String> inviteToken = Optional.empty();

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

  public Optional<String> getEmail() {
    return email;
  }

  public void setEmail(Optional<String> email) {
    this.email = email;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public Optional<String> getInviteToken() {
    return inviteToken;
  }

  public void setInviteToken(Optional<String> inviteToken) {
    this.inviteToken = inviteToken;
  }
}
