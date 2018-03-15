package com.natenelles.timeapp.service.intf;

import com.natenelles.timeapp.model.MealRequest;
import com.natenelles.timeapp.entity.Meal;
import com.natenelles.timeapp.model.MealResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Optional;

public interface MealService {
  public Page<MealResponse> findByUserId(long userId, Pageable pageable);

  public MealResponse createMeal(long userId, MealRequest mealRequest);

  public Page<MealResponse> findMealsInTimeRange(final long userId, final LocalDateTime startDateTime,
                                                 final LocalDateTime endDateTime, final Pageable pageable);

  Optional<Meal> getMeal(long id);

  MealResponse updateMeal(MealRequest mealRequest, Meal meal);

  void deleteMeal(long id);
}
