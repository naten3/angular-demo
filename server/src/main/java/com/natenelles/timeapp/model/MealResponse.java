package com.natenelles.timeapp.model;

import java.time.LocalDateTime;

public class MealResponse {
  private long id;
  private long userId;
  private LocalDateTime mealTime;
  private int calorieValue;
  private String description;

  public MealResponse(final long id, final long userId,
                      final LocalDateTime mealTime,
                      final int calorieValue, final String description) {
    this.id = id;
    this.userId = userId;
    this.mealTime = mealTime;
    this.calorieValue = calorieValue;
    this.description = description;
  }

  public long getId() {
    return id;
  }

  public void setId(final long id) {
    this.id = id;
  }

  public long getUserId() {
    return userId;
  }

  public void setUserId(final long userId) {
    this.userId = userId;
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
