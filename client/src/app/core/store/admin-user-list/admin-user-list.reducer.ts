import { createSelector } from 'reselect';
import { Action, combineReducers } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import * as fromAdminUserListActions from 'app/core/store/actions/admin-user-list.actions';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';
import { State, initialState } from 'app/core/models/admin-user-list';
import { UserInfo } from 'app/core/models/session';
import { Page } from 'app/core/models/common';

export function reducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case fromAdminUserListActions.INCREMENT_PAGE:
           if (!state.userPage || !state.userPage.last ) {
              return {
                page: state.page + 1,
                userPage: state.userPage,
                currentlyManagedUser: state.currentlyManagedUser
              };
           } else {
               console.log('Ignoring increment, at last page');
           }
        case fromAdminUserListActions.DECREMENT_PAGE:
          if (state.page > 0 ) {
            return {
              page: state.page - 1,
              userPage: state.userPage,
              currentlyManagedUser: state.currentlyManagedUser
            };
           } else {
             console.log('Ignoring decrement, at first page');
           }
        case fromAdminUserListActions.CHANGE_PAGE:
            return {
              page: action.payload,
              userPage: state.userPage,
              currentlyManagedUser: state.currentlyManagedUser
            };
        case fromAdminUserListActions.USER_LIST_PAGE_SUCCESS:
            if ( action.payload.page === state.page) {
              return {
                page: state.page,
                userPage: action.payload.userPage,
                currentlyManagedUser: state.currentlyManagedUser
              };
            } else {
                console.log('Ignoring user page update since it\'s not for active page');
            }
        case fromUserUpdate.USER_UPDATE_SUCCESS:
        // tslint:disable no-use-before-declare
          return replaceUser(state, action.payload.id, action.payload);
        case fromUserUpdate.PROFILE_IMAGE_UPDATE_SUCCESS:
        // tslint:disable no-use-before-declare
          return replaceProfilePicture(state, action.payload.id, action.payload.url);
        case fromAdminUserListActions.MANAGE_USER:
          return Object.assign(cloneDeep(state), {currentlyManagedUser: action.payload});
        default:
            return state;
    };
};

type UserReplace = ( ui: UserInfo) => UserInfo;
const applyOperationToMatchingUser: (State, number, UserReplace) => State =
(state, id, userReplaceFunc) => {
  const matchesManagedUser = !!state.currentlyManagedUser &&
  state.currentlyManagedUser.id === id;
  const userOnPage = !!state.userPage && state.userPage.content.find( x => x.id === id);
  if (matchesManagedUser || userOnPage) {
    let newManagedUser;
    if (matchesManagedUser) {
      newManagedUser = userReplaceFunc(cloneDeep(state.currentlyManagedUser));
    } else {
      newManagedUser = state.currentlyManagedUser;
    }

    let newUserPage;
    if (userOnPage) {
      const pageClone: Page<UserInfo> = cloneDeep(state.userPage);
      pageClone.content = pageClone.content.map(user => user.id === id ?
        userReplaceFunc(cloneDeep(user)) : user );
    } else {
      newUserPage = state.userPage;
    }

    const result = cloneDeep(state);
    result.currentlyManagedUser = newManagedUser;
    result.userPage = newUserPage;
    return result;
  } else {
    return state;
  }
};

const replaceProfilePicture = (state: State, id: number, newUrl: string) =>
applyOperationToMatchingUser(state, id, (user) => {
  user.profileImage = newUrl;
  return user;
});

const replaceUser = (state: State, id: number, userInfo: UserInfo) =>
applyOperationToMatchingUser(state, id, (user) => userInfo);
