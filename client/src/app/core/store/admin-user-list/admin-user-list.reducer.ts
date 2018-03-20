import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import * as fromAdminUserListActions from 'app/core/store/actions/admin-user-list.actions';
import { initialState } from 'app/core/models/admin-user-list';

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case fromAdminUserListActions.INCREMENT_PAGE:
           if (!state.userPage || !state.userPage.last ) {
              return {
                page: state.page + 1,
                userPage: state.userPage
              };
           } else {
               console.log('Ignoring increment, at last page');
           }
        case fromAdminUserListActions.DECREMENT_PAGE:
          if (state.page > 0 ) {
            return {
              page: state.page - 1,
              userPage: state.userPage
            };
           } else {
             console.log('Ignoring decrement, at first page');
           }
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






