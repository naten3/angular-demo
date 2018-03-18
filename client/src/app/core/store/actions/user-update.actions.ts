export const CREATE_USER_REQUEST = '[User Update] CREATE';
export const USER_CREATE_SUCCESS = '[User Update] CREATE SUCCESS';
export const USER_CREATE_FAILURE = '[User Update] CREATE FAILURE';
export const USER_CREATE_RESET = '[User Update] CREATE RESET';

export const UPDATE_USER_REQUEST = '[User Update] UPDATE';
export const USER_UPDATE_SUCCESS = '[User Update] UPDATE SUCCESS';
export const USER_UPDATE_FAILURE = '[User Update] UPDATE FAILURE';
export const USER_UPDATE_RESET = '[User Update] UPDATE RESET';

import { UserSaveRequest } from 'app/core/models/user-save';
import { UserUpdateForm, UserUpdateRequest } from 'app/core/models/user-update';
import { UserInfo } from 'app/core/models/session';

export const createUser = (userSaveRequest: UserSaveRequest) => {
    return { 'type': CREATE_USER_REQUEST, 'payload': userSaveRequest };
};
export const userCreateSuccess = () => { return {'type': USER_CREATE_SUCCESS}; };
export const userCreateFailure = (errors: Array<string>) => {
    return {'type': USER_CREATE_FAILURE, 'payload': errors};
};

export const userCreateReset = () => { return {'type': USER_CREATE_RESET}; };

export const updateUser = (userUpdateRequest: UserUpdateRequest) => {
    return {'type': UPDATE_USER_REQUEST, 'payload': userUpdateRequest};
};
export const userUpdateSuccess = (userInfo: UserInfo) => {
    return {'type': USER_UPDATE_SUCCESS, 'payload': userInfo};
};
export const userUpdateFailure = (errors: Array<string>) => {
    return {'type': USER_UPDATE_FAILURE, 'payload': errors};
};

export const userUpdateReset = () => { return {'type': USER_UPDATE_RESET}; };
