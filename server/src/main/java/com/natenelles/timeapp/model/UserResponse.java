package com.natenelles.timeapp.model;

import java.util.Optional;
import java.util.Set;

public class UserResponse {

  private Long id;
  private String username;
  private String email;
  private String profileImage;
  private Set<String> roles;

  public UserResponse(Long id, String username, String email, String profileImages, Set<String> roles) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.profileImage = profileImages;
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

  public String getProfileImage() {
    return profileImage;
  }

  public void setProfileImage(String profileImage) {
    this.profileImage = profileImage;
  }

  public void setRoles(final Set<String> roles) {
    this.roles = roles;
  }
}
