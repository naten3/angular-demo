import { Chance } from 'chance';

import * as fromActions from 'app/core/store/actions/session.actions';
import { initialState, State } from '../../models/session/session.state';
import { reducer } from './';

const chance = new Chance();

describe('Session reducer', () => {
  const username = chance.string();
  const password = chance.string();
  const state = initialState;
  let newState: State;

  describe('when a login action is received', () => {
    beforeEach(() => {
      const action = fromActions.login(username, password);
      newState = reducer(state, action);
    });

    it('should set pendingUpdate to true', () => {
      expect(newState.pendingUpdate).toBe(true);
    });
  });
});
