package io.abnd.repository;

import io.abnd.entity.Meal;
import io.abnd.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
  Page<Meal> findByUserId(long userId, Pageable pageable);

  @Query("select m from Meal m where m.userId = :userId and m.mealTime between :startDateTime and :endDateTime")
  Page<Meal> findByUserIdAndMealTimeBetween(@Param("userId") long userId, @Param("startDateTime") LocalDateTime startDateTime,
                                            @Param("endDateTime") LocalDateTime endDateTime,
                                            Pageable pageable);

  public void deleteByUserId(long useId);
}
