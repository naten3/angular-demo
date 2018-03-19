import { UserInfo } from 'app/core/models/session';

export interface State {
    page: number;
    users: Array<UserInfo>;
}

export const initialState: State = {
    page: 0,
    users: []
};

