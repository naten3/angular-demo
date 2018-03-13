import { State } from 'app/core/models/session';

export const getUserInfo = (state: State) => {
    console.log('user info is ' + JSON.stringify(state.userInfo));
    return state.userInfo;
};
export const getPendingUpdate = (state: State) => state.pendingUpdate;
export const getHasFetchedStatus = (state: State) => state.hasFetchedStatus;
export const identity = (state: State) => state;
