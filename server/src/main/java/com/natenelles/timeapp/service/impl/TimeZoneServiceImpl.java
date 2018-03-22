package com.natenelles.timeapp.service.impl;

import com.natenelles.timeapp.entity.UserTimeZone;
import com.natenelles.timeapp.exception.ResourceNotFoundException;
import com.natenelles.timeapp.model.TimeZone;
import com.natenelles.timeapp.repository.TimeZoneRepository;
import com.natenelles.timeapp.service.intf.TimeZoneService;
import com.natenelles.timeapp.service.intf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

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
  public Page<TimeZone> findByUserId(long userId, Pageable pageable) {
    return timeZoneRepository.findByUserId(userId, pageable).map(this::convertToModel);
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
  public Page<TimeZone> findTimeZonesWithName(long userId, String name, Pageable pageable) {
    return null;
  }

  @Override
  public TimeZone updateTimeZone(TimeZone timeZone) {
    return null;
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

    return timeZone;
  }

  private UserTimeZone convertToEntity (TimeZone tz, long userId) {
    UserTimeZone tze = new UserTimeZone();
    tze.setId(tz.getId().orElse(null));
    tze.setCityName(tz.getCityName());
    tze.setOffsetHours(tz.getOffsetHours());
    tze.setOffsetMinutes(tz.getOffsetMinutes());
    tze.setPositiveOffset(tz.isPositiveOffset());
    tze.setUserId(userId);

    return tze;
  }
}
