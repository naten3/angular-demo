import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import * as fromAdminUserListActions from 'app/core/store/actions/admin-user-list.actions';
import { initialState } from 'app/core/models/admin-user-list';

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case fromAdminUserListActions.CHANGE_PAGE:
            return {
              page: action.payload,
              userPage: state.userPage
            };
        case fromAdminUserListActions.USER_LIST_PAGE_SUCCESS:
            if ( action.payload.page === state.page) {
              return {
                page: state.page,
                userPage: action.payload.userPage
              };
            } else {
                console.log('Ignoring user page update since it\'s not for active page');
            }
        default:
            return state;
    };
};






