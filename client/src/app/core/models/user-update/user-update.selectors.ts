import { State } from 'app/core/models/user-update';

export const getPendingUpdate = (state: State) => state ? state.pendingUpdate : false;
export const getSubmitted = (state: State) => state ? state.submitted : false;
export const getSuccess = (state: State) => state ? state.success : false;
export const getErrors = (state: State) => state ? state.errors : [];
