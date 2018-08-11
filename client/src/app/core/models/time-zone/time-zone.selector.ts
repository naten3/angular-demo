import { State } from 'app/core/models/time-zone';

export const getUserTimeZones = (state: State) => state.timeZones;
export const getTimeZones = (state: State) => (!!state.timeZones ? state.timeZones.timeZones : null);
export const getUser = (state: State) => state.user;
export const getFetchErrors = (state: State) => state.fetchErrors;
