package com.natenelles.timeapp.service.impl;

import com.natenelles.timeapp.entity.UserTimeZone;
import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.model.TimeZone;
import com.natenelles.timeapp.repository.TimeZoneRepository;
import com.natenelles.timeapp.service.intf.TimeZoneService;
import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional
@Service
public class TimeZoneServiceImpl implements TimeZoneService {

  private final TimeZoneRepository timeZoneRepository;
  private final UserService userService;

  @Autowired
  public TimeZoneServiceImpl(final TimeZoneRepository timeZoneRepository,
                             final UserService userService) {
    this.timeZoneRepository = timeZoneRepository;
    this.userService = userService;
  }


  @Override
  public List<TimeZone> findByUserId(long userId) {
    return timeZoneRepository.findByUserId(userId).stream()
            .map(this::convertToModel)
            .collect(Collectors.toList());
  }

  @Override
  public TimeZone createTimeZone(long userId, TimeZone timeZone) {
    if(!userService.getUser(userId).isPresent()) {
      throw new ResourceNotFoundException("No matching user");
    }
    UserTimeZone userTimeZone = timeZoneRepository.save(convertToEntity(timeZone, userId));
    return convertToModel(userTimeZone);
  }

  @Override
  public TimeZone updateTimeZone(TimeZone timeZone, long id) {
    UserTimeZone utz = timeZoneRepository.findOne(id);
    if(utz == null) {
      throw new ResourceNotFoundException("No matching time zone");
    }
    UserTimeZone update = convertToEntity(timeZone, utz.getUserId());
    UserTimeZone userTimeZone = timeZoneRepository.save(update);
    return convertToModel(userTimeZone);
  }

  @Override
  public void deleteTimeZone(long id) {
    if (timeZoneRepository.getOne(id) == null) {
      throw new ResourceNotFoundException();
    }
    timeZoneRepository.delete(id);
  }

  @Override
  public long getTimeZoneOwner(long id) {
    return Optional.ofNullable(timeZoneRepository.findOne(id))
            .map(UserTimeZone::getUserId)
            .orElseThrow(() -> new ResourceNotFoundException());
  }

  private TimeZone convertToModel(UserTimeZone tze) {
    TimeZone timeZone = new TimeZone();
    timeZone.setId(Optional.of(tze.getId()));
    timeZone.setCityName(tze.getCityName());
    timeZone.setOffsetHours(tze.getOffsetHours());
    timeZone.setOffsetMinutes(tze.getOffsetMinutes());
    timeZone.setPositiveOffset(tze.isPositiveOffset());
    timeZone.setTimeZoneName(tze.getTimeZoneName());

    return timeZone;
  }

  private UserTimeZone convertToEntity (TimeZone tz, long userId) {
    UserTimeZone tze = new UserTimeZone();
    tze.setId(tz.getId().orElse(null));
    tze.setCityName(tz.getCityName());
    tze.setOffsetHours(tz.getOffsetHours());
    tze.setOffsetMinutes(tz.getOffsetMinutes());
    tze.setPositiveOffset(tz.isPositiveOffset());
    tze.setTimeZoneName(tz.getTimeZoneName());
    tze.setUserId(userId);

    return tze;
  }
}
