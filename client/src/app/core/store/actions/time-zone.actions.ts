export const REQUEST_NEW_TIME_ZONE_STATE = '[Time Zone] REQUEST NEW';
export const TIME_ZONE_REQUEST = '[Time Zone] REQUEST';
export const TIME_ZONE_SUCCESS = '[Time Zone] SUCCESS';
export const TIME_ZONE_FAILURE = '[Time Zone] FAILURE';
export const TIME_ZONE_RESET = '[Time Zone] RESET';

export const TIME_ZONE_USER_REQUEST = '[Time Zone] USER REQUEST';
export const TIME_ZONE_USER_SUCCESS = '[Time Zone] USER SUCCESS';
export const TIME_ZONE_USER_FAILURE = '[Time Zone] USER FAILURE';

export const SET_TIME_ZONE_USER = '[Time Zone] SET USER';

import { UserInfo } from 'app/core/models/session';
import { TimeZone } from 'app/core/models/time-zone';

// Use this to request from route guard
export const requestNewTimeZoneState = (userid: number) => {
  return { 'type': REQUEST_NEW_TIME_ZONE_STATE, 'payload': userid };
};

export const requestTimeZones = (userId: number) => {
  return { 'type': TIME_ZONE_REQUEST, 'payload': userId };
};
export const timeZoneSuccess = (userId: number, timeZones: Array<TimeZone>) => {
  return { 'type': TIME_ZONE_SUCCESS, 'payload': {userId, timeZones} };
};
export const timeZoneFailure  = (userId: number, errors: Array<string>) => {
  return { 'type': TIME_ZONE_FAILURE, 'payload': {userId, errors} };
  };

export const timeZoneReset  = () => {return { 'type': TIME_ZONE_RESET}; };

export const requestTimeZoneUser = (userId: number) => {
  return { 'type': TIME_ZONE_USER_SUCCESS, 'payload': userId};
};

export const requestTimeZoneUserSuccess = (userInfo: UserInfo) => {
  return { 'type': TIME_ZONE_USER_SUCCESS, 'payload': userInfo};
};

export const requestTimeZoneUserFailure = (userid: number) => {
  return { 'type': TIME_ZONE_USER_FAILURE, 'payload': { userid }};
};

export const setTimeZoneUser = (userInfo: UserInfo) => {
  return { 'type': SET_TIME_ZONE_USER, 'payload': userInfo};
}
