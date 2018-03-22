package com.natenelles.timeapp.model;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Optional;

public class TimeZone {
    private Optional<Long> id = Optional.empty();

    @NotNull
    private boolean positiveOffset;

    @Min(0)
    @Max(23)
    @NotNull
    private int offsetHours;

    @Min(0)
    @Max(60)
    @NotNull
    private int offsetMinutes;

    @NotEmpty
    @Max(300)
    private String cityName;

    @NotEmpty
    @Max(300)
    private String timeZoneName;

    public Optional<Long> getId() {
        return id;
    }

    public void setId(Optional<Long> id) {
        this.id = id;
    }

    public boolean isPositiveOffset() {
        return positiveOffset;
    }

    public void setPositiveOffset(boolean positiveOffset) {
        this.positiveOffset = positiveOffset;
    }

    public int getOffsetHours() {
        return offsetHours;
    }

    public void setOffsetHours(int offsetHours) {
        this.offsetHours = offsetHours;
    }

    public int getOffsetMinutes() {
        return offsetMinutes;
    }

    public void setOffsetMinutes(int offsetMinutes) {
        this.offsetMinutes = offsetMinutes;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getTimeZoneName() {
        return timeZoneName;
    }

    public void setTimeZoneName(String timeZoneName) {
        this.timeZoneName = timeZoneName;
    }
}


