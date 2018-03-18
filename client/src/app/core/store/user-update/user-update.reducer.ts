import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import * as fromActions from 'app/core/store/actions/user-update.actions';
import { initialState } from 'app/core/models/user-update';

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case fromActions.UPDATE_USER_REQUEST:
          return {
            success: state.success,
            submitted: true,
            pendingUpdate: true,
            errors: state.errors
          };
        case fromActions.USER_UPDATE_SUCCESS:
          return {
            success: true,
            submitted: true,
            pendingUpdate: false,
            errors: null
          };
        case fromActions.USER_UPDATE_FAILURE:
          return {
            success: false,
            submitted: true,
            pendingUpdate: false,
            errors: action.payload
          };
        case fromActions.USER_UPDATE_RESET:
          return initialState;
        default:
            return state;
    };
};






