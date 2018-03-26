package com.natenelles.timeapp.rest;

import com.natenelles.timeapp.model.TimeZone;
import com.natenelles.timeapp.security.CustomSpringUser;
import com.natenelles.timeapp.service.intf.TimeZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.natenelles.timeapp.util.SecurityUtil.checkOwnerOrAdmin;

@RestController
public class TimeZoneController {

  @Autowired
  private TimeZoneService timeZoneService;

  @GetMapping("/users/{userId}/time-zones")
  public @ResponseBody
  List<TimeZone> getUserTimeZones(@AuthenticationPrincipal CustomSpringUser principal, @PathVariable long userId){
    checkOwnerOrAdmin(principal, userId);
    return timeZoneService.findByUserId(userId);
  }

  @GetMapping("/users/me/time-zones")
  public @ResponseBody
  List<TimeZone> getMyTimeZones(@AuthenticationPrincipal CustomSpringUser principal){
    return getUserTimeZones(principal, principal.getId());
  }

  @PutMapping("/time-zones/{id}")
  public @ResponseBody TimeZone updateTimeZone(@AuthenticationPrincipal CustomSpringUser principal,
                                                   @PathVariable long id, @RequestBody TimeZone timeZone){
    checkOwnerOrAdmin(principal, timeZoneService.getTimeZoneOwner(id));
    return timeZoneService.updateTimeZone(timeZone, id);
  }

  @PostMapping("/users/{userId}/time-zones")
  public @ResponseBody TimeZone createMeal(@AuthenticationPrincipal CustomSpringUser principal,
                                               @PathVariable long userId, @RequestBody TimeZone timeZone) {
    checkOwnerOrAdmin(principal, userId);
    return timeZoneService.createTimeZone(userId, timeZone);
  }

  @DeleteMapping("/time-zones/{id}")
  public void deleteMeal(@AuthenticationPrincipal CustomSpringUser principal,
                    @PathVariable long id){
    checkOwnerOrAdmin(principal, timeZoneService.getTimeZoneOwner(id));
    timeZoneService.deleteTimeZone(id);
  }
}
