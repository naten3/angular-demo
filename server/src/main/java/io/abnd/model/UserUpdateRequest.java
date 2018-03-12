package io.abnd.model;

import java.util.Optional;
import java.util.Set;

public class UserUpdateRequest {
  private Optional<Integer> desiredCalories;
  private String email;

  public Optional<Integer> getDesiredCalories() {
    return desiredCalories;
  }

  public void setDesiredCalories(final Optional<Integer> desiredCalories) {
    this.desiredCalories = desiredCalories;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(final String email) {
    this.email = email;
  }
}
