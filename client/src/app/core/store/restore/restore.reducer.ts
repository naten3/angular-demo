import { Action } from '@ngrx/store';
import * as appActions from '../actions/save.actions';
import { merge } from 'ramda';

export const restoreStateReducer = (reducer: any) => {
  return (state: any, action: Action) => {
    if (!action) {
      return;
    }
    if (action.type === appActions.RESTORE_APP_STATE_SUCCESS && state) {
      state = merge(state, action.payload);
    }
    return reducer(state, action);
  };
};
