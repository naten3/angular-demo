package com.natenelles.timeapp.service.intf;

import com.natenelles.timeapp.model.TimeZone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface TimeZoneService {
  List<TimeZone> findByUserId(long userId);

  TimeZone createTimeZone(long userId, TimeZone timeZone);

  TimeZone updateTimeZone(TimeZone timeZone, long id);

  void deleteTimeZone(long id);

  long getTimeZoneOwner(long id);
}
