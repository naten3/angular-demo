package com.natenelles.timeapp.model.users;

import java.util.Optional;

public class UserUpdateRequest {
  private String firstName;
  private String lastName;
  // Right now role may be ADMIN or USER_ADMIN, USER means take aways special roles
  private Optional<String> role = Optional.empty();

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

  public Optional<String> getRole() {
    return role;
  }

  public void setRole(Optional<String> role) {
    this.role = role;
  }
}
