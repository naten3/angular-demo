package io.abnd.entity;

import org.hibernate.annotations.Cascade;

import javax.persistence.CascadeType;
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
  private Integer desiredCalories;
  private String email;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "USER_ROLE", joinColumns=@JoinColumn(name="USER_ID"),
  inverseJoinColumns=@JoinColumn(name="ROLE_NAME"))
  private Set<UserRole> roles = new HashSet<>();

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

  public Integer getDesiredCalories() {
    return desiredCalories;
  }

  public void setDesiredCalories(final Integer desiredCalories) {
    this.desiredCalories = desiredCalories;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public Set<UserRole> getRoles() {
    return roles;
  }

  public void setRoles(final Set<UserRole> roles) {
    this.roles = roles;
  }
}
