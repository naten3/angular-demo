package com.natenelles.timeapp.model;

import java.util.Optional;
import java.util.Set;

public class UserUpdateRequest {
  private String firstName;
  private String lastName;
  // Right now role may be ADMIN or USER_ADMIN, they will be mutually exclusive
  private Optional<String> adminRole = Optional.empty();

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

  public Optional<String> getAdminRole() {
    return adminRole;
  }

  public void setAdminRole(Optional<String> adminRole) {
    this.adminRole = adminRole;
  }
}
