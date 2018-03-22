package com.natenelles.timeapp.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Table(name = "UESR_TIME_ZONE")
@Entity
public class UserTimeZone {

    @Id
    @GeneratedValue
    @Column(name = "USER_TIME_ZONE_ID")
    private Long id;
    private long userId;
    private boolean positiveOffset;
    private int offsetHours;
    private int offsetMinutes;
    private String cityName;
    private String timeZoneName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
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
