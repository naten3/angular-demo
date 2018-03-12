export const REQUEST_STATUS = '[Session] request';
export const REQUEST_STATUS_ERROR = '[Session] request';
export const SESSION_INFO_UPDATE = '[Session] info udpate';

export const requestSessionStatus = () => { return { 'type': REQUEST_STATUS, 'payload': '' }; };
export const loadSessionInfo = (sessionInfo) => { return { 'type': SESSION_INFO_UPDATE, 'payload': sessionInfo }; };
export const sessionStatusError = () => { return { 'type': REQUEST_STATUS_ERROR, 'payload': '' }; };
