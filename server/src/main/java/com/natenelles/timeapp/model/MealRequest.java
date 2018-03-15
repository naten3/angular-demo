package com.natenelles.timeapp.model;

import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class MealRequest {
  private LocalDateTime mealTime;
  private int calorieValue;
  @Size(max = 500)
  private String description;

  public MealRequest(){}

  public MealRequest(final LocalDateTime mealTime,
                     final int calorieValue, final String description) {

    this.mealTime = mealTime;
    this.calorieValue = calorieValue;
    this.description = description;
  }

  public LocalDateTime getMealTime() {
    return mealTime;
  }

  public void setMealTime(final LocalDateTime mealTime) {
    this.mealTime = mealTime;
  }

  public int getCalorieValue() {
    return calorieValue;
  }

  public void setCalorieValue(final int calorieValue) {
    this.calorieValue = calorieValue;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(final String description) {
    this.description = description;
  }
}
