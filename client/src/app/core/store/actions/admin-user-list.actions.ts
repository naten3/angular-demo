import { UserInfo } from 'app/core/models/session';
import { Page } from 'app/core/models/common';

export const CHANGE_PAGE = '[Admin User List] change page';
export const INCREMENT_PAGE = '[Admin User List] increment page';
export const DECREMENT_PAGE = '[Admin User List] decrement page';
export const REQUEST_USER_LIST_PAGE = '[Admin User List] request user page';
export const USER_LIST_PAGE_SUCCESS = '[Admin User List] request user page success';
export const USER_LIST_PAGE_FAILURE = '[Admin User List] request user page failure';

export const MANAGE_USER = '[Admin User List] manage user';
export const REQUEST_MANAGED_USER = '[Admin User List] request managed user';
export const REQUEST_MANAGED_USER_SUCCESS = '[Admin User List] request managed success';
export const REQUEST_MANAGED_USER_FAILURE = '[Admin User List] request managed failure';
export const MANAGED_USER_RESET = '[Admin User List] managed user reset';
export const incrementPage = () => {
  return { type: INCREMENT_PAGE };
};
export const decrementPage = () => {
  return { type: DECREMENT_PAGE };
};
export const changePage = (page: number) => {
  return { type: CHANGE_PAGE, payload: page };
};
export const requestUserListPage = (page: number) => {
  return { type: REQUEST_USER_LIST_PAGE, payload: page };
};
export const getUserListPageSuccess = (page: number, userPage: Page<UserInfo>) => {
  return { type: USER_LIST_PAGE_SUCCESS, payload: { page, userPage } };
};
export const getUserListPageFailure = (errors: Array<string>) => {
  return { type: USER_LIST_PAGE_FAILURE, payload: { errors } };
};

export const manageUser = (userInfo: UserInfo) => {
  return { type: MANAGE_USER, payload: userInfo };
};

export const requestManagedUser = (userId: number) => {
  return { type: REQUEST_MANAGED_USER, payload: userId };
};

export const requestManagedUserSucces = (userInfo: UserInfo) => {
  return { type: REQUEST_MANAGED_USER_SUCCESS, payload: userInfo };
};

export const requestManagedUserFailure = (id: number) => {
  return { type: REQUEST_MANAGED_USER_FAILURE, payload: { id } };
};

export const managedUserReset = () => {
  return { type: MANAGED_USER_RESET };
};
