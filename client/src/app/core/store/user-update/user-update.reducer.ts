import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { LOGOUT } from 'app/core/store/actions/session.actions';

import * as fromActions from 'app/core/store/actions/user-update.actions';
import { initialState } from 'app/core/models/user-update';

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case LOGOUT:
          return initialState;
        case fromActions.UPDATE_USER_REQUEST:
          return Object.assign(cloneDeep(state),
          {
            success: false,
            submitted: true,
            pendingUpdate: true,
            errors: []});
        case fromActions.USER_UPDATE_SUCCESS:
          return Object.assign(cloneDeep(state),
          {
            success: true,
            submitted: true,
            pendingUpdate: false,
            errors: []
          });
        case fromActions.USER_UPDATE_FAILURE:
          return Object.assign(cloneDeep(state),
          {
            success: false,
            submitted: true,
            pendingUpdate: false,
            errors: action.payload
          });
        case fromActions.USER_UPDATE_RESET:
          return initialState;
        case fromActions.UPDATE_PASSWORD_RESET:
          return Object.assign(cloneDeep(state),
          {
            passwordSuccess: false,
            passwordSubmitted: false,
            passwordPendingUpdate: false,
            passwordErrors: []
          });
        case fromActions.UPDATE_PASSWORD_REQUEST:
          return Object.assign(cloneDeep(state),
          {
            passwordSuccess: false,
            passwordSubmitted: true,
            passwordPendingUpdate: true,
            passwordErrors: []
          });
        case fromActions.UPDATE_PASSWORD_SUCCESS:
          return Object.assign(cloneDeep(state),
          {
            passwordSuccess: true,
            passwordSubmitted: true,
            passwordPendingUpdate: false,
            passwordErrors: []
          });
        case fromActions.UPDATE_PASSWORD_FAILURE:
          return Object.assign(cloneDeep(state),
          {
            passwordSuccess: false,
            passwordSubmitted: true,
            passwordPendingUpdate: false,
            passwordErrors: action.payload
          });        
          case fromActions.DELETE_USER_REQUEST:
          return Object.assign(cloneDeep(state),
          {
            deleteSuccess: false,
            deleteSubmitted: true,
            deletePendingUpdate: true,
            deleteErrors: []
          });
        case fromActions.DELETE_USER_SUCCESS:
          return Object.assign(cloneDeep(state),
          {
            deleteSuccess: true,
            deleteSubmitted: true,
            deletePendingUpdate: false,
            deleteErrors: []
          });
        case fromActions.DELETE_USER_FAILURE:
          return Object.assign(cloneDeep(state),
          {
            deleteSuccess: false,
            deleteSubmitted: true,
            deletePendingUpdate: false,
            deleteErrors: action.payload
          });
        default:
          return state;
    };
};






