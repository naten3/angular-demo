import * as fromUserInviteActions from 'app/core/store/actions/user-invite.actions';
import { initialState } from 'app/core/models/user-invite/user-invite.state';
import { T, F, not, evolve } from 'ramda';

export function reducer(state = initialState, action) {
  switch (action.type) {
    case fromUserInviteActions.USER_INVITE_REQUEST:
      return {
        success: state.success,
        submitted: true,
        pendingUpdate: true,
        errors: state.errors
      };
    case fromUserInviteActions.USER_INVITE_SUCCESS:
      return {
        success: true,
        submitted: true,
        pendingUpdate: false,
        errors: []
      };
    case fromUserInviteActions.USER_INVITE_FAILURE:
      return {
        success: false,
        submitted: true,
        pendingUpdate: false,
        errors: action.payload
      };
    case fromUserInviteActions.USER_INVITE_RESET:
      return initialState;
    default:
      return state;
  }
}
