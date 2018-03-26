import { State } from 'app/core/models/user-update';

export const getPendingUpdate = (state: State) => state ? state.pendingUpdate : false;
export const getSubmitted = (state: State) => state ? state.submitted : false;
export const getSuccess = (state: State) => state ? state.success : false;
export const getErrors = (state: State) => state ? state.errors : [];

export const getPasswordPendingUpdate = (state: State) => state ? state.passwordPendingUpdate : false;
export const getPasswordSubmitted = (state: State) => state ? state.passwordSubmitted : false;
export const getPasswordSuccess = (state: State) => state ? state.passwordSuccess : false;
export const getPasswordErrors = (state: State) => state ? state.passwordErrors : [];

export const getUnlockPendingUpdate = (state: State) => state.pendingUpdate;

