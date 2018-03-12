package io.abnd.repository;

import io.abnd.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  public Optional<User> findByUsername(String username);

  @Query("select case when (count(u) > 0)  then true else false end  \n"
  + "from User u where u.username = :username")
  public boolean doesUserExist(String username);

  @Query("select u FROM User AS u JOIN u.roles AS r WHERE r.roleName = ?1")
  public Page<User> findAllByRole(String roleName, Pageable pageable);

  @Query("select count(u) FROM User u where u.username = ?1")
  public int usernameCount(String username);

  @Query("select count(u) FROM User u where u.email = ?1")
  public int emailCount(String email);
}
