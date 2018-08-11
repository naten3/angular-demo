import { createSelector } from 'reselect';
import { RouterState, initialState as initialRouterState } from '@ngrx/router-store';

import * as fromSessionState from 'app/core/models/session';
import * as fromUserSave from 'app/core/models/user-save';
import * as fromSave from 'app/core/models/common/save.state';
import * as fromUserUpdate from 'app/core/models/user-update';
import * as fromAdminUserList from 'app/core/models/admin-user-list';
import * as fromUserInvite from 'app/core/models/user-invite';
import * as fromTimeZone from 'app/core/models/time-zone';

export interface State {
  router?: RouterState;
  save: fromSave.State;
  session: fromSessionState.State;
  addUser: fromUserSave.State;
  updateUser: fromUserUpdate.State;
  adminUserList: fromAdminUserList.State;
  userInvite: fromUserInvite.State;
  timeZone: fromTimeZone.State;
}

export const initialState: State = {
  router: initialRouterState,
  session: fromSessionState.initialState,
  addUser: fromUserSave.initialState,
  updateUser: fromUserUpdate.initialState,
  save: fromSave.initialState,
  adminUserList: fromAdminUserList.initialState,
  userInvite: fromUserInvite.initialState,
  timeZone: fromTimeZone.initialState
};
