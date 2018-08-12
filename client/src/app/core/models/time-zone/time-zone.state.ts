import { UserTimeZones } from './';
import { UserInfo } from 'app/core/models/session';

export interface State {
  timeZones?: UserTimeZones;
  user?: UserInfo;
  fetchErrors: boolean;
}

export const initialState: State = {
  timeZones: null,
  user: null,
  fetchErrors: false
};
