import { Action } from '@ngrx/store';
import { cloneDeep, clone } from 'lodash';

import * as fromAdminUserListActions from 'app/core/store/actions/admin-user-list.actions';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';
import { State, initialState } from 'app/core/models/admin-user-list';
import { UserInfo } from 'app/core/models/session';
import { Page } from 'app/core/models/common';
import { LOGOUT } from 'app/core/store/actions/session.actions';

export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    case fromAdminUserListActions.INCREMENT_PAGE:
      if (!state.userPage || !state.userPage.last) {
        return {
          page: state.page + 1,
          userPage: state.userPage,
          currentlyManagedUser: state.currentlyManagedUser,
          deletedUsers: state.deletedUsers
        };
      } else {
        console.log('Ignoring increment, at last page');
        return state;
      }
    case fromAdminUserListActions.DECREMENT_PAGE:
      if (state.page > 0) {
        return {
          page: state.page - 1,
          userPage: state.userPage,
          currentlyManagedUser: state.currentlyManagedUser,
          deletedUsers: state.deletedUsers
        };
      } else {
        console.log('Ignoring decrement, at first page');
        return state;
      }
    case fromAdminUserListActions.CHANGE_PAGE:
      return {
        page: action.payload,
        userPage: state.userPage,
        currentlyManagedUser: state.currentlyManagedUser,
        deletedUsers: state.deletedUsers
      };
    case fromAdminUserListActions.USER_LIST_PAGE_SUCCESS:
      if (action.payload.page === state.page) {
        return {
          page: state.page,
          userPage: action.payload.userPage,
          currentlyManagedUser: state.currentlyManagedUser,
          deletedUsers: state.deletedUsers
        };
      } else {
        console.log("Ignoring user page update since it's not for active page");
        return state;
      }
    case fromUserUpdate.USER_UPDATE_SUCCESS:
      // tslint:disable no-use-before-declare
      return replaceUser(state, action.payload.id, action.payload);
    case fromUserUpdate.PROFILE_IMAGE_UPDATE_SUCCESS:
      // tslint:disable no-use-before-declare
      return replaceProfilePicture(state, action.payload.id, action.payload.url);
    case fromAdminUserListActions.MANAGE_USER:
      return Object.assign(clone(state), {
        currentlyManagedUser: action.payload
      });
    case fromAdminUserListActions.REQUEST_MANAGED_USER_SUCCESS:
      return Object.assign(clone(state), {
        currentlyManagedUser: action.payload,
        fetchManagedUserFailure: false
      });
    case fromAdminUserListActions.REQUEST_MANAGED_USER_FAILURE:
      return Object.assign(clone(state), { fetchManagedUserFailure: true });
    case fromAdminUserListActions.MANAGED_USER_RESET:
      return Object.assign(clone(state), {
        currentlyManagedUser: null,
        fetchManagedUserFailure: false
      });
    case fromUserUpdate.DELETE_USER_SUCCESS:
      const newDeletedUsers = new Set(state.deletedUsers);
      newDeletedUsers.add(action.payload);
      const assignObj: any = {};
      assignObj.deletedUsers = newDeletedUsers;
      const managedUser = state.currentlyManagedUser;
      if (!!managedUser && managedUser.id === action.payload) {
        assignObj.currentlyManagedUser = null;
        assignObj.fetchManagedUserFailure = false;
      }
      return Object.assign(clone(state), assignObj);
    case fromUserUpdate.UNLOCK_USER_SUCCESS:
      // tslint:disable no-use-before-declare
      return unlockUser(state, action.payload);
    default:
      return state;
  }
}

type UserReplace = (ui: UserInfo) => UserInfo;
const applyOperationToMatchingUser: (State, number, UserReplace) => State = (state, id, userReplaceFunc) => {
  const matchesManagedUser = !!state.currentlyManagedUser && state.currentlyManagedUser.id === id;
  const userOnPage = !!state.userPage && !!state.userPage.content.find(x => x.id === id);
  if (matchesManagedUser || userOnPage) {
    let newManagedUser;
    if (matchesManagedUser) {
      newManagedUser = userReplaceFunc(cloneDeep(state.currentlyManagedUser));
    } else {
      newManagedUser = state.currentlyManagedUser;
    }

    let newUserPage;
    if (userOnPage) {
      const pageClone: Page<UserInfo> = clone(state.userPage);
      pageClone.content = pageClone.content.map(user => (user.id === id ? userReplaceFunc(cloneDeep(user)) : user));
    } else {
      newUserPage = state.userPage;
    }

    const result = clone(state);
    result.currentlyManagedUser = newManagedUser;
    result.userPage = newUserPage;
    return result;
  } else {
    return state;
  }
};

const replaceProfilePicture = (state: State, id: number, newUrl: string) =>
  applyOperationToMatchingUser(state, id, user => {
    user.profileImage = newUrl;
    return user;
  });

const replaceUser = (state: State, id: number, userInfo: UserInfo) => applyOperationToMatchingUser(state, id, user => userInfo);

const unlockUser = (state: State, id: number) =>
  applyOperationToMatchingUser(state, id, user => {
    user.accountLocked = false;
    return user;
  });
