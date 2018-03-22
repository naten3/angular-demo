package com.natenelles.timeapp.service.intf;

import com.natenelles.timeapp.model.TimeZone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface TimeZoneService {
  Page<TimeZone> findByUserId(long userId, Pageable pageable);

  TimeZone createTimeZone(long userId, TimeZone timeZone);

  Page<TimeZone> findTimeZonesWithName(final long userId, final String name, final Pageable pageable);

  TimeZone updateTimeZone(TimeZone timeZone);

  void deleteTimeZone(long id);

  long getTimeZoneOwner(long id);
}
