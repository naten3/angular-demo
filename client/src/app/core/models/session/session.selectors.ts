import { State } from 'app/core/models/session';

export const getSessionInfo = (state: State) => {
    console.log('session info is ' + JSON.stringify(state.sessionInfo));
    return state.sessionInfo;
};
export const getPendingUpdate = (state: State) => state.pendingUpdate;
