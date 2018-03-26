export const CREATE_USER_REQUEST = '[User Update] CREATE';
export const USER_CREATE_SUCCESS = '[User Update] CREATE SUCCESS';
export const USER_CREATE_FAILURE = '[User Update] CREATE FAILURE';
export const USER_INVITE_CREATE_REQUEST = '[User Update] USER INVITE CREATE';

export const USER_CREATE_RESET = '[User Update] CREATE RESET';

export const UPDATE_USER_REQUEST = '[User Update] UPDATE';
export const USER_UPDATE_SUCCESS = '[User Update] UPDATE SUCCESS';
export const USER_UPDATE_FAILURE = '[User Update] UPDATE FAILURE';
export const USER_UPDATE_RESET = '[User Update] UPDATE RESET';

export const UPDATE_PASSWORD_REQUEST = '[User Update] UPDATE PASSWORD';
export const UPDATE_PASSWORD_SUCCESS = '[User Update] UPDATE PASSWORD SUCCESS';
export const UPDATE_PASSWORD_FAILURE = '[User Update] UPDATE PASSWORD FAILURE';
export const UPDATE_PASSWORD_RESET = '[User Update] UPDATE PASSWORD RESET';

export const DELETE_USER_REQUEST = '[User Update] DELETE USER';
export const DELETE_USER_SUCCESS = '[User Update] DELETE USER SUCCESS';
export const DELETE_USER_FAILURE = '[User Update] DELETE USER FAILURE';

export const UNLOCK_USER_REQUEST = '[User Update] UNLOCK USER';
export const UNLOCK_USER_SUCCESS = '[User Update] UNLOCK USER SUCCESS';
export const UNLOCK_USER_FAILURE = '[User Update] UNLOCK USER FAILURE';

export const PROFILE_IMAGE_UPDATE_SUCCESS = '[User Update] UPDATE PROFILE IMAGE SUCCESS';
export const PROFILE_IMAGE_UPDATE_FAILURE = '[User Update] UPDATE PROFILE IMAGE FAILURE';

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

export const userInviteCreate = (userSaveRequest: UserSaveRequest) => {
    return { 'type': USER_INVITE_CREATE_REQUEST, 'payload': userSaveRequest };
};

export const userCreateReset = () => { return {'type': USER_CREATE_RESET}; };

export const updateUser = (userUpdateRequest: UserUpdateRequest) => {
    return {'type': UPDATE_USER_REQUEST, 'payload': userUpdateRequest};
};
export const userUpdateSuccess = (userInfo: UserInfo) => {
    return {'type': USER_UPDATE_SUCCESS, 'payload': userInfo};
};
export const userUpdateFailure = (errors: Array<string>, userId: number) => {
    return {'type': USER_UPDATE_FAILURE, 'payload': {errors, userId}};
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

export const deleteUserRequest = (userId: number) => {
    return {'type': DELETE_USER_REQUEST, 'payload': userId};
};
export const deleteUserSuccess = (userId: number) => {
    return {'type': DELETE_USER_SUCCESS, payload: userId};
};
export const deleteUserFailure = (errors: Array<string>) => {
    return {'type': DELETE_USER_FAILURE, 'payload': errors};
};

export const unlockUserRequest = (userId: number) => {
  return {'type': UNLOCK_USER_REQUEST, 'payload': userId};
};
export const unlockUserSuccess = (userId: number) => {
  return {'type': UNLOCK_USER_SUCCESS, payload: userId};
};
export const unlockUserFailure = (errors: Array<string>) => {
  return {'type': UNLOCK_USER_FAILURE, 'payload': errors};
};

export const updateProfileImageSuccess = (id: number, url: string) => {
    return {'type': PROFILE_IMAGE_UPDATE_SUCCESS, 'payload': {
        id,
        url
    }};
};

export const updateProfileImageFailure = (id: number) => {
  return {'type': PROFILE_IMAGE_UPDATE_FAILURE, 'payload': id};
};

