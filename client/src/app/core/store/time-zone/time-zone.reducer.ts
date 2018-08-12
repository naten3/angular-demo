import { Action } from '@ngrx/store';
import { clone } from 'lodash';

import * as fromTimeZoneActions from 'app/core/store/actions/time-zone.actions';
import { State, initialState } from 'app/core/models/time-zone';
import { LOGOUT } from 'app/core/store/actions/session.actions';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case fromTimeZoneActions.TIME_ZONE_SUCCESS:
      return Object.assign(clone(state), {
        timeZones: {
          userId: action.payload.userId,
          timeZones: action.payload.timeZones
        }
      });
    case fromTimeZoneActions.TIME_ZONE_FAILURE:
      return Object.assign(clone(state), { fetchErrors: true });
    case fromTimeZoneActions.SET_TIME_ZONE_USER:
      return Object.assign(clone(state), { user: action.payload });
    case fromTimeZoneActions.TIME_ZONE_USER_SUCCESS:
      return Object.assign(clone(state), { user: action.payload });
    case fromTimeZoneActions.TIME_ZONE_USER_FAILURE:
      return Object.assign(clone(state), { fetchErrors: true });
    case fromTimeZoneActions.CREATE_TIME_ZONE_SUCCESS:
      if (!!state.timeZones && state.timeZones.userId === action.payload.userId) {
        const newTimeZones = state.timeZones.timeZones.slice();
        newTimeZones.push(action.payload.timeZone);
        const newUserTimeZone = Object.assign(clone(state.timeZones), {
          timeZones: newTimeZones
        });
        return Object.assign(clone(state), {
          timeZones: newUserTimeZone
        });
      } else {
        return state;
      }
    case fromTimeZoneActions.CREATE_TIME_ZONE_FAILURE:
      // TODO
      return state;
    case fromTimeZoneActions.DELETE_TIME_ZONE_SUCCESS:
      if (!!state.timeZones && state.timeZones.userId === action.payload.userId) {
        const newTimeZones = state.timeZones.timeZones.filter(x => x.id !== action.payload.id);
        const newUserTimeZone = Object.assign(clone(state.timeZones), {
          timeZones: newTimeZones
        });
        return Object.assign(clone(state), {
          timeZones: newUserTimeZone
        });
      } else {
        return state;
      }
    case fromTimeZoneActions.UPDATE_TIME_ZONE_SUCCESS:
      if (!!state.timeZones && state.timeZones.userId === action.payload.userId) {
        const newTimeZones = state.timeZones.timeZones.map(x => (x.id === action.payload.timeZone.id ? action.payload.timeZone : x));
        const newUserTimeZone = Object.assign(clone(state.timeZones), {
          timeZones: newTimeZones
        });
        return Object.assign(clone(state), {
          timeZones: newUserTimeZone
        });
      } else {
        return state;
      }
    case fromUserUpdate.USER_UPDATE_SUCCESS:
      if (!!state.user && action.payload.id === state.user.id) {
        return Object.assign(clone(state), { user: action.payload });
      } else {
        return state;
      }
    case fromUserUpdate.PROFILE_IMAGE_UPDATE_SUCCESS:
      if (!!state.user && action.payload.id === state.user.id) {
        const newUserInfo = Object.assign(clone(state.user), {
          profileImage: action.payload.url
        });
        return Object.assign(clone(state), { user: newUserInfo });
      } else {
        return state;
      }
    case fromTimeZoneActions.DELETE_TIME_ZONE_FAILURE:
      // TODO
      return state;
    case fromTimeZoneActions.TIME_ZONE_RESET:
      return initialState;
    default:
      return state;
  }
}
