import { UserInfo } from 'app/core/models/session';

export const LOGIN = '[Auth] login';
export const LOGIN_STATUS_CHANGE = '[Auth] login status change';
export const LOGIN_FAILURE = '[Auth] login failure';
export const REQUEST_STATUS = '[Session] request';
export const REQUEST_STATUS_ERROR = '[Session] request';
export const SESSION_INFO_UPDATE = '[Session] info udpate';
export const INVALIDATE_SESSION_INFO = '[Session] info invalidate';
export const LOGOUT = '[Session] logout';
export const REMOVE_USER = '[Session] remove user';

export const requestSessionStatus = () => {
  return { type: REQUEST_STATUS, payload: '' };
};
export const loadUserInfo = userInfo => {
  return { type: SESSION_INFO_UPDATE, payload: userInfo };
};
export const sessionStatusError = () => {
  return { type: REQUEST_STATUS_ERROR, payload: '' };
};
export const invalidateSessionInfo = () => {
  return { type: INVALIDATE_SESSION_INFO };
};
export const removeUser = () => {
  return { type: REMOVE_USER };
};

export const login = (username, password) => {
  return { type: LOGIN, payload: { username, password } };
};
export const loginFailure = (errors: Array<string>) => {
  return { type: LOGIN_FAILURE, payload: errors };
};
export const logout = () => {
  return { type: LOGOUT };
};
export const loginStatusChange = (userInfo: UserInfo) => {
  return {
    type: LOGIN_STATUS_CHANGE,
    payload: userInfo
  };
};
