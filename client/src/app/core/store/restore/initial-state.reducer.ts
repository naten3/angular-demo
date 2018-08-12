import { Action, Dispatcher } from '@ngrx/store';

export const initialStateReducer = (_initialState: any) => (reducer: any) => {
  const initialState = typeof _initialState === 'function' ? _initialState() : _initialState;

  return (state: any, action: Action) => {
    if (action.type === Dispatcher.INIT) {
      state = initialState;
    }

    return reducer(state, action);
  };
};
