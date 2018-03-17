import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { CREATE_USER_REQUEST } from 'app/core/store/actions/user-update.actions';
import { SessionService } from 'app/core/services';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';

@Injectable()
export class UserUpdateEffects {
  constructor(
    private http: Http,
    private actions$: Actions
  ) { }

  /* tslint:disable member-ordering*/
  @Effect() login$ = this.actions$
      .ofType(CREATE_USER_REQUEST)
      .switchMap(action => {
        return this.http.post('/api/login', action.payload)
        .map(res => {
            if (res.json().success) {
                return fromUserUpdate.userCreateSuccess();
            } else {
              return fromUserUpdate.userCreateFailure(res.json().errors);
            }
        });
      });
}