package com.natenelles.timeapp.repository;

import com.natenelles.timeapp.entity.UserTimeZone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeZoneRepository extends JpaRepository<UserTimeZone, Long> {
  List<UserTimeZone> findByUserId(long userId);

  @Query("select t from UserTimeZone t where t.userId = :userId and t.timeZoneName like '%:name%'")
  Page<UserTimeZone> findByName(@Param("userId") long userId, @Param("name") String name,
                                Pageable pageable);

  void deleteByUserId(long useId);
}
