export const CREATE_USER_REQUEST = '[User Update] CREATE';
export const USER_CREATE_SUCCESS = '[User Update] CREATE SUCCESS';
export const USER_CREATE_FAILURE = '[User Update] CREATE FAILURE';
export const USER_CREATE_RESET = '[User Update] CREATE RESET';

export const UPDATE_USER_REQUEST = '[User Update] UPDATE';
export const USER_UPDATE_SUCCESS = '[User Update] UPDATE SUCCESS';
export const USER_UPDATE_FAILURE = '[User Update] UPDATE FAILURE';
export const USER_UPDATE_RESET = '[User Update] UPDATE RESET';

export const UPDATE_PASSWORD_REQUEST = '[User Update] UPDATE PASSWORD';
export const UPDATE_PASSWORD_SUCCESS = '[User Update] UPDATE PASSWORD SUCCESS';
export const UPDATE_PASSWORD_FAILURE = '[User Update] UPDATE PASSWORD FAILURE';
export const UPDATE_PASSWORD_RESET = '[User Update] UPDATE PASSWORD RESET';

export const PROFILE_IMAGE_UPDATE_SUCCESS = '[User Update] UPDATE PROFILE IMAGE SUCCESS';

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

export const updatePassword = (userId: number, password: string) => {
    return {'type': UPDATE_PASSWORD_REQUEST, 'payload': {userId, password}};
};
export const updatePasswordSuccess = () => {
    return {'type': UPDATE_PASSWORD_SUCCESS};
};
export const updatePasswordFailure = (errors: Array<string>) => {
    return {'type': UPDATE_PASSWORD_FAILURE, 'payload': errors};
};
export const updatePasswordReset = () => {
    return {'type': UPDATE_PASSWORD_RESET};
};

export const updateProfileImageSuccess = (id: number, url: string) => {
    return {'type': PROFILE_IMAGE_UPDATE_SUCCESS, 'payload': {
        id,
        url
    }};
}
