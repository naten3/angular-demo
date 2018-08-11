import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { clone } from 'lodash';

import * as fromActions from 'app/core/store/actions/session.actions';
import { initialState } from 'app/core/models/session';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case fromActions.LOGIN:
      return {
        userInfo: state.userInfo,
        pendingUpdate: true,
        hasFetchedStatus: state.hasFetchedStatus,
        loginErrors: []
      };
    case fromActions.LOGIN_FAILURE:
      return {
        userInfo: null,
        pendingUpdate: false,
        hasFetchedStatus: true,
        loginErrors: action.payload
      };
    case fromActions.LOGIN_STATUS_CHANGE:
      return {
        userInfo: action.payload,
        pendingUpdate: false,
        hasFetchedStatus: true,
        loginErrors: []
      };
    case fromActions.INVALIDATE_SESSION_INFO:
      return Object.assign(clone(state), { hasFetchedStatus: false });
    case fromUserUpdate.USER_UPDATE_SUCCESS:
      if (action.payload.id === state.userInfo.id) {
        return Object.assign(clone(state), { userInfo: action.payload });
      } else {
        return state;
      }
    case fromUserUpdate.PROFILE_IMAGE_UPDATE_SUCCESS:
      if (action.payload.id === state.userInfo.id) {
        const newUserInfo = Object.assign(clone(state.userInfo), {
          profileImage: action.payload.url
        });
        return Object.assign(clone(state), { userInfo: newUserInfo });
      } else {
        return state;
      }
    case fromActions.REMOVE_USER:
      return Object.assign(clone(initialState), {
        hasFetchedStatus: true,
        userInfo: null
      });
    default:
      return state;
  }
}
