package com.natenelles.timeapp.repository;

import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.entity.UserInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInviteRepository extends JpaRepository<UserInvite, String> {
  Optional<UserInvite> findByEmail(String email);
  Optional<UserInvite> findByVerificationToken(String token);
}
