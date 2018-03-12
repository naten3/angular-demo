

import { SessionInfo } from 'app/core/models/session';

export interface State {
    sessionInfo?: SessionInfo;
    pendingUpdate: boolean;
}

export const initialState = {
    sessionState: null,
    pendingUpdate: false
}