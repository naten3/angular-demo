import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { CREATE_USER_REQUEST, UPDATE_USER_REQUEST } from 'app/core/store/actions/user-update.actions';
import { SessionService } from 'app/core/services';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';
import { UserInfo } from 'app/core/models/session';

@Injectable()
export class UserUpdateEffects {
  constructor(
    private http: Http,
    private actions$: Actions
  ) { }

  /* tslint:disable member-ordering*/
  @Effect() createUser$ = this.actions$
      .ofType(CREATE_USER_REQUEST)
      .switchMap(action => {
        return this.http.post('/api/users', action.payload)
        .map(res => {
            if (res.json().success) {
                return fromUserUpdate.userCreateSuccess();
            } else {
              return fromUserUpdate.userCreateFailure(res.json().errors);
            }
        })
        .catch(e => Observable.of(fromUserUpdate.userCreateFailure(['unknown'])));
      });

    /* tslint:disable member-ordering*/
    @Effect() updateUser$ = this.actions$
    .ofType(UPDATE_USER_REQUEST)
    .switchMap(action => {
      const userId = action.payload.userId;
      // TODO roles;
      return this.http.put(`/api/users/${userId}`, action.payload.userUpdateForm, 
      { headers: SessionService.getSessionHeader()} )
      .map(res => {
          if (res.ok) {
              return fromUserUpdate.userUpdateSuccess(res.json().payload);
          } else {
            return fromUserUpdate.userUpdateFailure(res.json().errors);
          }
      })
      .catch(e => Observable.of(fromUserUpdate.userUpdateFailure(['unknown'])));
    });
}