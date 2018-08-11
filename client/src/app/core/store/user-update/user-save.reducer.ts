import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import * as fromActions from 'app/core/store/actions/user-update.actions';
import { initialState } from 'app/core/models/user-save';
import { LOGOUT } from 'app/core/store/actions/session.actions';

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case fromActions.CREATE_USER_REQUEST:
      return {
        success: false,
        submitted: true,
        pendingUpdate: true,
        errors: state.errors
      };
    case fromActions.USER_CREATE_SUCCESS:
      return {
        success: true,
        submitted: true,
        pendingUpdate: false,
        errors: []
      };
    case fromActions.USER_CREATE_FAILURE:
      return {
        success: false,
        submitted: true,
        pendingUpdate: false,
        errors: action.payload
      };
    case fromActions.USER_CREATE_RESET:
      return initialState;
    default:
      return state;
  }
}
