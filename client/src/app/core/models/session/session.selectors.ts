import { State } from 'app/core/models/session';
import { ROLE_ADMIN, ROLE_USER_ADMIN, ROLE_USER, checkIfAdmin, checkIfUserAdmin } from 'app/core/models/session';

export const getUserInfo = (state: State) => state.userInfo;
export const getPendingUpdate = (state: State) => state.pendingUpdate;
export const getHasFetchedStatus = (state: State) => state.hasFetchedStatus;
export const isAdmin = (state: State) => !!state.userInfo && checkIfAdmin(state.userInfo);
export const isUserAdmin = (state: State) => !!state.userInfo && checkIfUserAdmin(state.userInfo);
export const getLoginErrors = (state: State) => state.loginErrors;
export const identity = (state: State) => state;
