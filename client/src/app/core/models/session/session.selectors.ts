import { State } from 'app/core/models/session';
import { ROLE_ADMIN, ROLE_USER_ADMIN, ROLE_USER } from 'app/core/models/session';

export const getUserInfo = (state: State) => state.userInfo;
export const getPendingUpdate = (state: State) => state.pendingUpdate;
export const getHasFetchedStatus = (state: State) => state.hasFetchedStatus;
export const isAdmin = (state: State) => state.userInfo != null && state.userInfo.roles.has(ROLE_ADMIN);
export const isUserAdmin = (state: State) => state.userInfo != null && state.userInfo.roles.has(ROLE_USER_ADMIN);
export const identity = (state: State) => state;
