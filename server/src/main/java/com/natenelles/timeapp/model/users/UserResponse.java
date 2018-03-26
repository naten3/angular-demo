package com.natenelles.timeapp.model.users;

import java.util.Optional;
import java.util.Set;

public class UserResponse {

  private Long id;
  private String username;
  private String firstName;
  private String lastName;
  private String email;
  private boolean socialUser;
  private Optional<String> profileImage;
  private Optional<String> socialProfileImage;
  private boolean emailVerified;
  private boolean accountLocked;
  private Set<String> roles;

  public UserResponse(Long id, String username, String firstName, String lastName, String email, Optional<String> profileImage,
                      Optional<String> socialProfileImage, boolean socialUser, boolean emailVerified,
                      boolean accountLocked, Set<String> roles) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profileImage = profileImage;
    this.socialProfileImage = socialProfileImage;
    this.socialUser = socialUser;
    this.emailVerified = emailVerified;
    this.accountLocked = accountLocked;
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

  public String getEmail() {
    return email;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public Optional<String> getProfileImage() {
    return profileImage;
  }

  public void setProfileImage(Optional<String> profileImage) {
    this.profileImage = profileImage;
  }

  public Optional<String> getSocialProfileImage() {
    return socialProfileImage;
  }

  public void setSocialProfileImage(Optional<String> socialProfileImage) {
    this.socialProfileImage = socialProfileImage;
  }

  public boolean isSocialUser() {
    return socialUser;
  }

  public void setSocialUser(boolean socialUser) {
    this.socialUser = socialUser;
  }

  public boolean isEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  public boolean isAccountLocked() {
    return accountLocked;
  }

  public void setAccountLocked(boolean accountLocked) {
    this.accountLocked = accountLocked;
  }

  public void setRoles(final Set<String> roles) {
    this.roles = roles;
  }
}
