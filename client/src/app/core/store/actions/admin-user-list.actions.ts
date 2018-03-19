import { UserInfo } from 'app/core/models/session';
import { Page } from 'app/core/models/common';

export const CHANGE_PAGE = '[Admin User List] change page';
export const REQUEST_USER_LIST_PAGE = '[Admin User List] request user page';
export const USER_LIST_PAGE_SUCCESS = '[Admin User List] request user page success';
export const USER_LIST_PAGE_FAILURE = '[Admin User List] request user page failure';

export const changePage = (page: number) => { return { 'type': CHANGE_PAGE, 'payload': page}; };
export const requestUserListPage = (page: number) => { return { 'type': REQUEST_USER_LIST_PAGE, 'payload': page }; };
export const getUserListPageSuccess = (page: number, userPage: Page<UserInfo>) => {
    return { 'type': USER_LIST_PAGE_SUCCESS, 'payload': { page, userPage }};
};
export const getUserListPageFailure = (errors: Array<string>) => {
    return { 'type': USER_LIST_PAGE_FAILURE, 'payload': { errors }};
};
