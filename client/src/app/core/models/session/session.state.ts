import { UserInfo } from 'app/core/models/session';

export interface State {
    userInfo?: UserInfo;
    pendingUpdate: boolean;
    hasFetchedStatus: boolean;
}

export const initialState: State = {
    userInfo: null,
    pendingUpdate: false,
    hasFetchedStatus: false
}

