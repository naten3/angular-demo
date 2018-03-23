import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep, clone } from 'lodash';

import * as fromTimeZoneActions from 'app/core/store/actions/time-zone.actions';
import { State, initialState } from 'app/core/models/time-zone';
import { UserInfo } from 'app/core/models/session';
import { LOGOUT } from 'app/core/store/actions/session.actions';

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case fromTimeZoneActions.TIME_ZONE_SUCCESS:
      return Object.assign(clone(state),
      { timeZones: { userId: action.payload.userId, timeZones: action.payload.timeZones} });
    case fromTimeZoneActions.TIME_ZONE_FAILURE:
      return Object.assign(clone(state), { fetchErrors: true});
    case fromTimeZoneActions.SET_TIME_ZONE_USER:
      return Object.assign(clone(state), { user: action.payload });
    case fromTimeZoneActions.TIME_ZONE_USER_SUCCESS:
      return Object.assign(clone(state), {user: action.payload });
    case fromTimeZoneActions.TIME_ZONE_USER_FAILURE:
      return Object.assign(clone(state), { fetchErrors: true});
    case fromTimeZoneActions.TIME_ZONE_RESET:
      return initialState;
    default:
        return state;
  };
};
