package com.natenelles.timeapp.repository;

import com.natenelles.timeapp.entity.User;
import com.natenelles.timeapp.entity.UserInviteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInviteRepository extends JpaRepository<UserInviteEntity, String> {
  Optional<User> findByEmail(String email);
  Optional<User> findByVerificationToken(String token);
}
