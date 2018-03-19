import { UserInfo } from 'app/core/models/session';
import { Page } from 'app/core/models/common';

export interface State {
    page: number;
    userPage?: Page<UserInfo>;
}

export const initialState: State = {
    page: 0,
    userPage: null
};

