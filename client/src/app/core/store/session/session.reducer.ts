import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import {
    append, filter, prop, assoc, lensPath, over,
    propSatisfies, when, not, map, compose, evolve, __,
    identity, view, find, propEq
} from 'ramda';
import * as fromActions from '../actions/session.actions';
import { initialState } from 'app/core/models/session';

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
        default:
            return state;
    };
};






