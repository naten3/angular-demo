package io.abnd.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity(name = "ROLE")
public class UserRole {

  public static final String USER = "USER";
  public static final String USER_ADMIN = "USER_ADMIN";
  public static final String ADMIN = "ADMIN";

  public UserRole() {
  }

  public UserRole(final String roleName) {
    this.roleName = roleName;
  }

  @Id
  private String roleName;

  @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
  public Set<User> users;

  public String getRoleName() {
    return roleName;
  }

  public void setRoleName(final String roleName) {
    this.roleName = roleName;
  }

  public Set<User> getUsers() {
    return users;
  }

  public void setUsers(final Set<User> users) {
    this.users = users;
  }
}
