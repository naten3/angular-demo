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

  private boolean facebookUser = false;

  private boolean twitterUser = false;

  private String profileImage;

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

  public boolean isFacebookUser() {
    return facebookUser;
  }

  public void setFacebookUser(boolean facebookUser) {
    this.facebookUser = facebookUser;
  }

  public boolean isTwitterUser() {
    return twitterUser;
  }

  public void setTwitterUser(boolean twitterUser) {
    this.twitterUser = twitterUser;
  }

  public String getProfileImage() {
    return profileImage;
  }

  public void setProfileImage(String profileImage) {
    this.profileImage = profileImage;
  }

  public Set<UserRole> getRoles() {
    return roles;
  }

  public void setRoles(final Set<UserRole> roles) {
    this.roles = roles;
  }
}
