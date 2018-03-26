package com.natenelles.timeapp.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Entity
public class User {
  @Id
  @GeneratedValue
  @Column(name = "USER_ID")
  private long id;

  @Column(updatable = false)
  private String username;

  private String password;
  private String email;

  @Column(name = "EMAIL_VERIFIED")
  private  boolean emailVerified = false;

  @Column(name = "EMAIL_VERIFICATION_TOKEN")
  private String emailVerificationToken;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "USER_ROLE", joinColumns=@JoinColumn(name="USER_ID"),
  inverseJoinColumns=@JoinColumn(name="ROLE_NAME"))
  private Set<UserRole> roles = new HashSet<>();

  private String facebookId;
  private String googleId;

  private String profileImage;
  private String socialProfileImage;

  private String firstName;
  private String lastName;

  private int invalidLoginCount;
  boolean accountLocked;

  public long getId() {
    return id;
  }

  public void setId(final long id) {
    this.id = id;
  }

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

  public boolean isEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  public String getEmailVerificationToken() {
    return emailVerificationToken;
  }

  public void setEmailVerificationToken(String emailVerificationToken) {
    this.emailVerificationToken = emailVerificationToken;
  }

  public Optional<String> getFacebookId() {
    return Optional.ofNullable(facebookId);
  }

  public void setFacebookId(Optional<String> facebookId) {
    this.facebookId = facebookId.orElse(null);
  }

  public Optional<String> getGoogleId() {
    return Optional.ofNullable(googleId);
  }

  public void setGoogleId(Optional<String> googleId) {
    this.googleId = googleId.orElse(null);
  }

  public Optional<String> getProfileImage() {
    return Optional.ofNullable(profileImage);
  }

  public void setProfileImage(Optional<String> profileImage) {
    this.profileImage = profileImage.orElse(null);
  }

  public Optional<String> getSocialProfileImage() {
    return Optional.ofNullable(socialProfileImage);
  }

  public void setSocialProfileImage(Optional<String> profileImage) {
    this.socialProfileImage = profileImage.orElse(null);
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

  public int getInvalidLoginCount() {
    return invalidLoginCount;
  }

  public void setInvalidLoginCount(int invalidLoginCount) {
    this.invalidLoginCount = invalidLoginCount;
  }

  public void incrementInvalidLoginCount() {
    invalidLoginCount++;
  }

  public boolean isAccountLocked() {
    return accountLocked;
  }

  public void setAccountLocked(boolean accountLocked) {
    this.accountLocked = accountLocked;
  }

  public Set<UserRole> getRoles() {
    return roles;
  }

  public void setRoles(final Set<UserRole> roles) {
    this.roles = roles;
  }
}
