export const CREATE_USER_REQUEST = '[User Update] CREATE';
export const USER_CREATE_SUCCESS = '[User Update] CREATE SUCCESS';
export const USER_CREATE_FAILURE = '[User Update] CREATE FAILURE';
import { UserSaveRequest } from 'app/core/models/user-save';

export const createUser = (userSaveRequest: UserSaveRequest) => {
    return { 'type': CREATE_USER_REQUEST, 'payload': userSaveRequest };
};
export const userCreateSuccess = () => { return {'type': USER_CREATE_SUCCESS}; };
export const userCreateFailure = (errors: Array<string>) => {
    return {'type': USER_CREATE_FAILURE, 'payload': errors};
};
