import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import * as fromActions from 'app/core/store/actions/session.actions';
import { initialState } from 'app/core/models/session';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case fromActions.LOGIN:
            return {
              userInfo: state.userInfo,
              pendingUpdate: true,
              hasFetchedStatus: state.hasFetchedStatus
            };
        case fromActions.LOGIN_FAILURE:
            return {
                userInfo: null,
              pendingUpdate: false,
              hasFetchedStatus: true
            };
        case fromActions.LOGIN_STATUS_CHANGE:
            return {
                userInfo: action.payload,
                 pendingUpdate: false,
                 hasFetchedStatus: true
            };
        case fromActions.INVALIDATE_SESSION_INFO:
            const clone = cloneDeep(state);
            clone.hasFetchedStatus = false;
            return clone;
        case fromUserUpdate.USER_UPDATE_SUCCESS:
            if (action.payload.id === state.userInfo.id) {
                return Object.assign(cloneDeep(state), {userInfo: action.payload});
            }
        default:
            return state;
    };
};






