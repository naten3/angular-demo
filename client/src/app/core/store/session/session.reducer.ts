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
        case fromActions.REQUEST_STATUS:
            return {
              sessionInfo: state.sessionState,
              pendingUpdate: true
            };
        case fromActions.REQUEST_STATUS_ERROR:
            return {
              sessionInfo: null,
              pendingUpdate: false
            };
        case fromActions.SESSION_INFO_UPDATE:
         return {
            sessionInfo: action.payload,
            pendingUpdate: false
          };
        default:
            return state;
    };
};






