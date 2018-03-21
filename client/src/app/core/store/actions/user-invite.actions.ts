export const USER_INVITE_REQUEST = '[User Invite] REQUEST';
export const USER_INVITE_SUCCESS = '[User Invite] SUCCESS';
export const USER_INVITE_FAILURE = '[User Invite] FAILURE';
export const USER_INVITE_RESET = '[User Invite] RESET';

import { UserSaveRequest } from 'app/core/models/user-save';
import { UserUpdateForm, UserUpdateRequest } from 'app/core/models/user-update';
import { UserInfo } from 'app/core/models/session';

export const inviteUser = (email: string) => {
    return { 'type': USER_INVITE_REQUEST, 'payload': email };
};
export const userInviteSuccess = (email: string) => { return {'type': USER_INVITE_SUCCESS, 'payload': email}; };
export const userInviteFailure = (errors: Array<string>) => {
    return {'type': USER_INVITE_FAILURE, 'payload': errors};
};

export const userInviteReset = () => { return {'type': USER_INVITE_RESET}; };

