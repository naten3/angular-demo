import * as fromRouter from '@ngrx/router-store';

import { createSelector } from 'reselect';
import { State } from 'app/core/models/app.state';
import * as fromSession from 'app/core/models/session';
import * as fromSave from 'app/core/models/common/save.state';
import * as fromUserSave from 'app/core/models/user-save';
import * as fromUserUpdate from 'app/core/models/user-update';
import * as fromAdminUserList from 'app/core/models/admin-user-list';
import * as fromUserInvite from 'app/core/models/user-invite';
import * as fromTimeZone from 'app/core/models/time-zone';

export const getAppState = (state: State) => state;

export const getRouterState = (state: State) => state.router;
export const getRouterPath = createSelector(getRouterState, (state: fromRouter.RouterState) => {
  if (state) {
    return state.path;
  }
});

export const getSaveState = (state: State) => state.save;
export const getSaveStateLoading = createSelector(getSaveState, fromSave.getLoading);

export const getSessionState = (state: State) => state.session;
export const getAuthenticated = (state: State) => !!state.session.userInfo;
export const getSession = createSelector(getSessionState, fromSession.identity);
export const getUserInfo = createSelector(getSessionState, fromSession.getUserInfo);
export const getPendingSessionUpdate = createSelector(getSessionState, fromSession.getPendingUpdate);
export const getHasFetchedSessionStatus = createSelector(getSessionState, fromSession.getHasFetchedStatus);
export const getUserLoginErrors = createSelector(getSessionState, fromSession.getLoginErrors);
export const isAdmin = createSelector(getSessionState, fromSession.isAdmin);
export const isUserAdmin = createSelector(getSessionState, fromSession.isUserAdmin);

export const getUserSave = (state: State) => state.addUser;
export const getUserSavePending = createSelector(getUserSave, fromUserSave.getPendingUpdate);
export const getUserSaveSubmitted = createSelector(getUserSave, fromUserSave.getSubmitted);
export const getUserSaveSuccess = createSelector(getUserSave, fromUserSave.getSuccess);
export const getUserSaveErrors = createSelector(getUserSave, fromUserSave.getErrors);

export const getUserUpdate = (state: State) => state.updateUser;
export const getUserUpdatePending = createSelector(getUserUpdate, fromUserUpdate.getPendingUpdate);
export const getUserUpdateSubmitted = createSelector(getUserUpdate, fromUserUpdate.getSubmitted);
export const getUserUpdateSuccess = createSelector(getUserUpdate, fromUserUpdate.getSuccess);
export const getUserUpdateErrors = createSelector(getUserUpdate, fromUserUpdate.getErrors);
export const getUnlockPendingUpdate = createSelector(getUserUpdate, fromUserUpdate.getUnlockPendingUpdate);

export const getPasswordUpdatePending = createSelector(getUserUpdate, fromUserUpdate.getPasswordPendingUpdate);
export const getPasswordUpdateSubmitted = createSelector(getUserUpdate, fromUserUpdate.getPasswordSubmitted);
export const getPasswordUpdateSuccess = createSelector(getUserUpdate, fromUserUpdate.getPasswordSuccess);
export const getPasswordUpdateErrors = createSelector(getUserUpdate, fromUserUpdate.getPasswordErrors);

export const getAdminUserList = (state: State) => state.adminUserList;
export const getAdminUserPageNumber = createSelector(getAdminUserList, fromAdminUserList.getPageNumber);
export const getAdminUserPage = createSelector(getAdminUserList, fromAdminUserList.getUserPage);
export const getOtherUserInfo = (id: number) => createSelector(getAdminUserList, fromAdminUserList.getUserInfo(id));
export const getCurrentlyManagedUser = createSelector(getAdminUserList, fromAdminUserList.getManagedUser);
export const getManagedUserError = createSelector(getAdminUserList, fromAdminUserList.getManagedUserError);
export const getAdminDeletedUsers = createSelector(getAdminUserList, fromAdminUserList.getDeletedUsers);

export const getUserInvite = (state: State) => state.userInvite;
export const getUserInvitePending = createSelector(getUserInvite, fromUserInvite.getPendingUpdate);
export const getUserInviteSubmitted = createSelector(getUserInvite, fromUserInvite.getSubmitted);
export const getUserInviteSuccess = createSelector(getUserInvite, fromUserInvite.getSuccess);
export const getUserInviteErrors = createSelector(getUserInvite, fromUserInvite.getErrors);

export const getTimeZoneState: (state: State) => fromTimeZone.State = (state: State) => state.timeZone;
export const getUserTimeZones = createSelector(getTimeZoneState, fromTimeZone.getUserTimeZones);
export const getTimeZones = createSelector(getTimeZoneState, fromTimeZone.getTimeZones);
export const getTimeZoneUser = createSelector(getTimeZoneState, fromTimeZone.getUser);
export const getTimeZoneHasErrors: (state: State) => boolean = createSelector(getTimeZoneState, fromTimeZone.getFetchErrors);
