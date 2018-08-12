import { Chance } from 'chance';

import * as fromActions from 'app/core/store/actions/session.actions';
import * as fromUserUpdateActions from 'app/core/store/actions/user-update.actions';
import { initialState, State } from '../../models/session/session.state';
import { reducer } from './';
import { getUserInfoMock } from '../../models/mock/user-info.mock';

const chance = new Chance();

describe('Session reducer', () => {
  let state: State;
  let newState: State;

  beforeEach(() => {
    state = initialState;
  });

  describe('when a login action is passed', () => {
    const username = chance.string();
    const password = chance.string();

    beforeEach(() => {
      const action = fromActions.login(username, password);
      newState = reducer(state, action);
    });

    it('should set pendingUpdate to true', () => {
      expect(newState.pendingUpdate).toBe(true);
    });
  });

  describe('when a login passed', () => {
    const errors = [chance.string()];
    beforeEach(() => {
      const action = fromActions.loginFailure(errors);
      newState = reducer(state, action);
    });

    it('should put loginErrors on state', () => {
      expect(newState.loginErrors).toBe(errors);
    });
  });

  describe('when a login statue change acction is passed', () => {
    const userInfo = chance.pickone([getUserInfoMock(), null]);
    beforeEach(() => {
      const action = fromActions.loginStatusChange(userInfo);
      newState = reducer(state, action);
    });

    it('should put userInfo on state', () => {
      expect(newState.userInfo).toBe(userInfo);
    });
  });

  describe('when an invalidate session info action is passed', () => {
    beforeEach(() => {
      state = {
        ...initialState,
        userInfo: getUserInfoMock(),
        hasFetchedStatus: true
      };
      const action = fromActions.invalidateSessionInfo();

      newState = reducer(state, action);
    });

    it('should set hasFetchedStatus to false', () => {
      expect(newState.hasFetchedStatus).toBe(false);
    });
  });

  describe('when a profile image update success action is passed for current user', () => {
    const profileImageUrl = chance.url();
    beforeEach(() => {
      state = {
        ...initialState,
        userInfo: getUserInfoMock(),
        hasFetchedStatus: true
      };
      const action = fromUserUpdateActions.updateProfileImageSuccess(state.userInfo.id, profileImageUrl);
      newState = reducer(state, action);
    });

    it('should update profile image for current user', () => {
      expect(newState.userInfo.profileImage).toBe(profileImageUrl);
    });
  });

  describe('when a profile image update success action is passed for different user', () => {
    const profileImageUrl = chance.url();
    beforeEach(() => {
      state = {
        ...initialState,
        userInfo: getUserInfoMock(),
        hasFetchedStatus: true
      };
      const action = fromUserUpdateActions.updateProfileImageSuccess(state.userInfo.id + 1, profileImageUrl);
      newState = reducer(state, action);
    });

    it('should do nothing', () => {
      expect(newState).toEqual(state);
    });
  });
});
