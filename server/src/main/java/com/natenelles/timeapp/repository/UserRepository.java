package com.natenelles.timeapp.repository;

import com.natenelles.timeapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  @Query("select u from User u where u.username = ?1 and u.emailVerified = true")
  Optional<User> findVerifiedEmailByUsername(String username);

  @Query("select case when (count(u) > 0)  then true else false end  \n"
  + "from User u where u.username = :username")
  boolean doesUserExist(String username);

  @Query("select u from User AS u where u.username = :username")
  User findByUsername(@Param("username") String username);

  @Query("select u FROM User AS u JOIN u.roles AS r WHERE r.roleName = ?1")
  Page<User> findAllByRole(String roleName, Pageable pageable);

  @Query("select count(u) FROM User u where u.username = ?1")
  int usernameCount(String username);

  @Query("select count(u) FROM User u where u.email = ?1")
  int emailCount(String email);
}
