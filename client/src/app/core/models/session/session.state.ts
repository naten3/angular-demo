import { UserInfo } from 'app/core/models/session';

export interface State {
    userInfo?: UserInfo;
    pendingUpdate: boolean;
    hasFetchedStatus: boolean;
    loginErrors: Array<string>;
}

export const initialState: State = {
    userInfo: null,
    pendingUpdate: false,
    hasFetchedStatus: false,
    loginErrors: []
}

