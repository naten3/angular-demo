package io.abnd.rest;

import io.abnd.entity.Meal;
import io.abnd.entity.UserRole;
import io.abnd.exception.ResourceNotFoundException;
import io.abnd.exception.UnauthorizedException;
import io.abnd.model.MealRequest;
import io.abnd.model.MealResponse;
import io.abnd.security.CustomSpringUser;
import io.abnd.service.intf.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class MealController {

  @Autowired
  private MealService mealService;

  @GetMapping("/users/{userId}/meals")
  public @ResponseBody Page<MealResponse> getMeals(@AuthenticationPrincipal CustomSpringUser principal, @PathVariable long userId, Pageable pageable)
  throws UnauthorizedException {
    if ((principal).getId() != userId && !principal.hasAuthority(UserRole.USER_ADMIN)) {
      throw new UnauthorizedException();
    }
    return mealService.findByUserId(userId, pageable);
  }

  @GetMapping(value = "/users/{userId}/meals", params={"startTime","endTime"})
  public @ResponseBody Page<MealResponse> getMealsBetweenDates(@AuthenticationPrincipal CustomSpringUser principal,
                                                               @PathVariable long userId,
                                                               @RequestParam(value = "startTime", required = true)
                                                                 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                                                                 LocalDateTime startTime,
                                                               @RequestParam(value = "endTime", required = true)
                                                                 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                                                                 LocalDateTime endTime,
                                                               Pageable pageable)
  throws UnauthorizedException {
    if ((principal).getId() != userId && !principal.hasAuthority(UserRole.USER_ADMIN)) {
      throw new UnauthorizedException();
    }
    return mealService.findMealsInTimeRange(userId, startTime, endTime, pageable);
  }


  @PutMapping("/meals/{id}")
  public @ResponseBody MealResponse updateMeal(@AuthenticationPrincipal CustomSpringUser principal,
                                               @PathVariable long id, @RequestBody MealRequest mealRequest)
  throws UnauthorizedException, ResourceNotFoundException {
    Meal meal = mealService.getMeal(id).orElseThrow(ResourceNotFoundException::new);
    if ((principal).getId() != meal.getUserId() && !principal.hasAuthority(UserRole.USER_ADMIN)) {
      throw new UnauthorizedException();
    }
    return mealService.updateMeal(mealRequest, meal);
  }

  @PostMapping("/users/{userId}/meals")
  public @ResponseBody MealResponse createMeal(@AuthenticationPrincipal CustomSpringUser principal,
                                               @PathVariable long userId, @RequestBody MealRequest mealRequest)
  throws UnauthorizedException {
    if ((principal).getId() != userId && !principal.hasAuthority(UserRole.USER_ADMIN)) {
      throw new UnauthorizedException();
    }
    return mealService.createMeal(userId, mealRequest);
  }

  @DeleteMapping("/meals/{id}")
  public void deleteMeal(@AuthenticationPrincipal CustomSpringUser principal,
                    @PathVariable long id)
  throws UnauthorizedException, ResourceNotFoundException{
    Meal meal = mealService.getMeal(id).orElseThrow(ResourceNotFoundException::new);
    if ((principal).getId() != meal.getUserId() && !principal.hasAuthority(UserRole.USER_ADMIN)) {
      throw new UnauthorizedException();
    }
    mealService.deleteMeal(id);
  }

}
