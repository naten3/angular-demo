export const REQUEST_NEW_TIME_ZONE_STATE = '[Time Zone] REQUEST NEW';
export const TIME_ZONE_REQUEST = '[Time Zone] REQUEST';
export const TIME_ZONE_SUCCESS = '[Time Zone] SUCCESS';
export const TIME_ZONE_FAILURE = '[Time Zone] FAILURE';
export const TIME_ZONE_RESET = '[Time Zone] RESET';

export const TIME_ZONE_USER_REQUEST = '[Time Zone] USER REQUEST';
export const TIME_ZONE_USER_SUCCESS = '[Time Zone] USER SUCCESS';
export const TIME_ZONE_USER_FAILURE = '[Time Zone] USER FAILURE';

export const SET_TIME_ZONE_USER = '[Time Zone] SET USER';

export const CREATE_TIME_ZONE = '[Time Zone] CREATE';
export const CREATE_TIME_ZONE_SUCCESS = '[Time Zone] CREATE SUCCESS';
export const CREATE_TIME_ZONE_FAILURE = '[Time Zone] CREATE FAILURE';

export const UPDATE_TIME_ZONE = '[Time Zone] UPDATE';
export const UPDATE_TIME_ZONE_SUCCESS = '[Time Zone] UPDATE SUCCESS';
export const UPDATE_TIME_ZONE_FAILURE = '[Time Zone] UPDATE FAILURE';

export const DELETE_TIME_ZONE = '[Time Zone] DELETE';
export const DELETE_TIME_ZONE_SUCCESS = '[Time Zone] DELETE SUCCESS';
export const DELETE_TIME_ZONE_FAILURE = '[Time Zone] DELETE FAILURE';

import { UserInfo } from 'app/core/models/session';
import { TimeZone } from 'app/core/models/time-zone';

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
  return { 'type': TIME_ZONE_USER_REQUEST, 'payload': userId};
};

export const requestTimeZoneUserSuccess = (userInfo: UserInfo) => {
  return { 'type': TIME_ZONE_USER_SUCCESS, 'payload': userInfo};
};

export const requestTimeZoneUserFailure = (userid: number) => {
  return { 'type': TIME_ZONE_USER_FAILURE, 'payload': { userid }};
};

export const setTimeZoneUser = (userInfo: UserInfo) => {
  return { 'type': SET_TIME_ZONE_USER, 'payload': userInfo};
};

export const createTimeZone = (timeZone: TimeZone,  userId: number) => {
  return { 'type': CREATE_TIME_ZONE, 'payload': { timeZone, userId}};
};
export const createTimeZoneSuccess = (timeZone: TimeZone,  userId: number) => {
  return { 'type': CREATE_TIME_ZONE_SUCCESS, 'payload': { timeZone, userId}};
};
export const createTimeZoneFailure = (userId: number) => {
  return { 'type': CREATE_TIME_ZONE_FAILURE, 'payload': userId};
};

export const updateTimeZone = (timeZone: TimeZone,  userId: number) => {
  return { 'type': UPDATE_TIME_ZONE, 'payload': { timeZone, userId}};
};
export const updateTimeZoneSuccess = (timeZone: TimeZone,  userId: number) => {
  return { 'type': UPDATE_TIME_ZONE_SUCCESS, 'payload': { timeZone, userId}};
};
export const updateTimeZoneFailure = (id: number, userId: number) => {
  return { 'type': UPDATE_TIME_ZONE_FAILURE, 'payload': {id, userId}};
};

export const deleteTimeZone = (id: number, userId: number) => {
  return { 'type': DELETE_TIME_ZONE, 'payload': { id, userId}};
};

export const deleteTimeSuccess = (id: number, userId: number) => {
  return { 'type': DELETE_TIME_ZONE_SUCCESS, 'payload': { id, userId}};
};

export const deleteTimeFailure = (id: number, userId: number) => {
  return { 'type': DELETE_TIME_ZONE_FAILURE, 'payload': { id, userId}};
};
