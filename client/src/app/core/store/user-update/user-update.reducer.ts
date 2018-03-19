import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import * as fromActions from 'app/core/store/actions/user-update.actions';
import { initialState } from 'app/core/models/user-update';

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case fromActions.UPDATE_USER_REQUEST:
          return {
            success: false,
            submitted: true,
            pendingUpdate: true,
            errors: []
          };
        case fromActions.USER_UPDATE_SUCCESS:
          return {
            success: true,
            submitted: true,
            pendingUpdate: false,
            errors: null
          };
        case fromActions.USER_UPDATE_FAILURE:
        const clone1 = cloneDeep(state);
        clone1.success = false;
        clone1.submitted = true;
        clone1.pendingUpdate = false;
        clone1.errors = action.payload;
        return clone1;
        case fromActions.USER_UPDATE_RESET:
          return initialState;
        case fromActions.UPDATE_PASSWORD_RESET:
          const clone2 = cloneDeep(state);
          clone2.passwordSuccess = false;
          clone2.passwordSubmitted = false;
          clone2.passwordPendingUpdate = false;
          clone2.passwordErrors = [];
          return clone2;
        case fromActions.UPDATE_PASSWORD_REQUEST:
          const clone3 = cloneDeep(state);
          clone3.passwordSuccess = false;
          clone3.passwordSubmitted = true;
          clone3.passwordPendingUpdate = true;
          clone3.errors = [];
        return clone3;
        case fromActions.UPDATE_PASSWORD_SUCCESS:
          const clone4 = cloneDeep(state);
          clone4.passwordSuccess = true;
          clone4.passwordSubmitted = true;
          clone4.passwordPendingUpdate = false;
          clone4.errors = [];
        return clone4;
        case fromActions.UPDATE_PASSWORD_FAILURE:
          const clone5 = cloneDeep(state);
          clone5.passwordSuccess = false;
          clone5.passwordSubmitted = true;
          clone5.passwordPendingUpdate = false;
          clone5.passwordErrors = action.payload;
        return clone5;
        default:
            return state;
    };
};






