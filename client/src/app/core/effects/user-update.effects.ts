import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/observable/concat';
import { Store } from '@ngrx/store';
import { back, go } from '@ngrx/router-store';

import { SessionService } from 'app/core/services';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';
import * as fromSession from 'app/core/store/actions/session.actions';
import { UserInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';

@Injectable()
export class UserUpdateEffects {
  constructor(
    private store: Store<fromRoot.State>,
    private http: Http,
    private actions$: Actions
  ) { }

  @Effect() createUser$ = this.actions$
    .ofType(fromUserUpdate.CREATE_USER_REQUEST)
    .switchMap(action => {
      return this.http.post('/api/users', action.payload)
      .map(res => {
        return fromUserUpdate.userCreateSuccess();
      })
      .catch(e => {
        if (!!e.json()) {
          return Observable.of(fromUserUpdate.userCreateFailure(e.json().errors));
        } else {
          return Observable.of(fromUserUpdate.userCreateFailure(['unknown']));
        }
      });
  });

  @Effect() createUserFromInvite$ = this.actions$
    .ofType(fromUserUpdate.USER_INVITE_CREATE_REQUEST)
    .switchMap(action => {
      return this.http.post('/api/users', action.payload)
      .switchMap(res => {
        SessionService.saveSessionId(res.headers['x-auth-token']);
        return Observable.of(fromUserUpdate.userCreateSuccess(), fromSession.loginStatusChange(res.json())) ;
      })
      .catch(e => {
        if (!!e.json()) {
          return Observable.of(fromUserUpdate.userCreateFailure(e.json().errors));
        } else {
          return Observable.of(fromUserUpdate.userCreateFailure(['unknown']));
        }
      });
  });

  @Effect() updateUser$ = this.actions$
  .ofType(fromUserUpdate.UPDATE_USER_REQUEST)
  .switchMap(action => {
    const userId = action.payload.userId;
    return this.http.put(`/api/users/${userId}`, action.payload.userUpdateForm, 
    { headers: SessionService.getSessionHeader()} )
    .map(res => {
        if (res.ok) {
            return fromUserUpdate.userUpdateSuccess(res.json());
        } else {
          return fromUserUpdate.userUpdateFailure(res.json().errors);
        }
    })
    .catch(e => Observable.of(fromUserUpdate.userUpdateFailure(['unknown'])));
  });

  @Effect() updatePassword$ = this.actions$
  .ofType(fromUserUpdate.UPDATE_PASSWORD_REQUEST)
  .switchMap(action => {
    const userId = action.payload.userId;
    return this.http.put(`/api/users/${userId}/password`, { password: action.payload.password },
    { headers: SessionService.getSessionHeader()} )
    .map(res => {
        if (res.json().success) {
            return fromUserUpdate.updatePasswordSuccess();
        } else {
          return fromUserUpdate.updatePasswordFailure(res.json().errors);
        }
    })
    .catch(e => Observable.of(fromUserUpdate.updatePasswordFailure(['unknown'])));
  });

  @Effect() deleteUser$ = this.actions$
  .ofType(fromUserUpdate.DELETE_USER_REQUEST)
  .switchMap(action => {
    const userId = action.payload;
    return this.http.delete(`/api/users/${userId}`,
    { headers: SessionService.getSessionHeader()} )
    .map(res => {
        if (res.ok) {
          return fromUserUpdate.deleteUserSuccess(userId);
        } else {
          return fromUserUpdate.userUpdateFailure(res.json().errors);
        }
    })
    .catch(e => Observable.of(fromUserUpdate.userUpdateFailure(['unknown'])));
  });

  @Effect() leaveDeletedUser$ = this.actions$
  .ofType(fromUserUpdate.DELETE_USER_SUCCESS)
  .map( action => fromUserUpdate.userUpdateReset());
}
