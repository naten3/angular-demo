export const LOGIN = '[Auth] login';
export const LOGIN_STATUS_CHANGE = '[Auth] login success';
export const LOGIN_FAILURE = '[Auth] login failure';
export const REQUEST_STATUS = '[Session] request';
export const REQUEST_STATUS_ERROR = '[Session] request';
export const SESSION_INFO_UPDATE = '[Session] info udpate';

export const requestSessionStatus = () => { return { 'type': REQUEST_STATUS, 'payload': '' }; };
export const loadUserInfo = (userInfo) => { return { 'type': SESSION_INFO_UPDATE, 'payload': userInfo }; };
export const sessionStatusError = () => { return { 'type': REQUEST_STATUS_ERROR, 'payload': '' }; };

export const login = (username, password) => { return { 'type': LOGIN, 'payload': {username, password} }; };
