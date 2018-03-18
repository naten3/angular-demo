package com.natenelles.timeapp.model.users;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Optional;
import java.util.Set;

public class UserResponse {
  @NotNull
  @Size(min = 1, max = 100)
  private String password;

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
