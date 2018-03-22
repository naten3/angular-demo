package com.natenelles.timeapp.rest;

import com.natenelles.timeapp.model.TimeZone;
import com.natenelles.timeapp.security.CustomSpringUser;
import com.natenelles.timeapp.service.intf.TimeZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

import static com.natenelles.timeapp.util.SecurityUtil.checkUserOrAdmin;

@RestController
public class TimeZoneController {

  @Autowired
  private TimeZoneService timeZoneService;

  @GetMapping("/users/{userId}/time-zones")
  public @ResponseBody Page<TimeZone> getUserTimeZones(@AuthenticationPrincipal CustomSpringUser principal, @PathVariable long userId, Pageable pageable){
    checkUserOrAdmin(principal, userId);
    return timeZoneService.findByUserId(userId, pageable);
  }

  @GetMapping(value = "/users/{userId}/time-zones", params={"name"})
  public @ResponseBody Page<TimeZone> getTimeZonesMatchingNames(@AuthenticationPrincipal CustomSpringUser principal,
                                                                    @PathVariable long userId,
                                                                    @RequestParam String name,
                                                                    Pageable pageable) {
    checkUserOrAdmin(principal, userId);
    return timeZoneService.findTimeZonesWithName(userId, name, pageable);
  }

  @PutMapping("/time-zones/{id}")
  public @ResponseBody TimeZone updateTimeZone(@AuthenticationPrincipal CustomSpringUser principal,
                                                   @PathVariable long id, @RequestBody TimeZone timeZone){
    checkUserOrAdmin(principal, timeZoneService.getTimeZoneOwner(id));
    return timeZoneService.updateTimeZone(timeZone);
  }

  @PostMapping("/users/{userId}/time-zones")
  public @ResponseBody TimeZone createMeal(@AuthenticationPrincipal CustomSpringUser principal,
                                               @PathVariable long userId, @RequestBody TimeZone timeZone) {
    checkUserOrAdmin(principal, userId);
    return timeZoneService.createTimeZone(userId, timeZone);
  }

  @DeleteMapping("/time-zones/{id}")
  public void deleteMeal(@AuthenticationPrincipal CustomSpringUser principal,
                    @PathVariable long id){
    checkUserOrAdmin(principal, timeZoneService.getTimeZoneOwner(id));
    timeZoneService.deleteTimeZone(id);
  }
}
