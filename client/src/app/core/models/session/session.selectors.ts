import { State } from 'app/core/models/session';

export const getUserInfo = (state: State) => {
    console.log('session info is ' + JSON.stringify(state.userInfo));
    return state.userInfo;
};
export const getPendingUpdate = (state: State) => state.pendingUpdate;
