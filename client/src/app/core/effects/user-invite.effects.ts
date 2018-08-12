import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { SessionService } from 'app/core/services';
import * as fromUserInviteActions from 'app/core/store/actions/user-invite.actions';
import * as fromRoot from 'app/core/store';

@Injectable()
export class UserInviteEffects {
  currentPage$: Observable<number>;

  constructor(private http: Http, private actions$: Actions, private store: Store<fromRoot.State>) {}

  @Effect()
  requestUserInvite$ = this.actions$.ofType(fromUserInviteActions.USER_INVITE_REQUEST).switchMap(action =>
    this.http
      .post(`/api/users//signup-invite`, { email: action.payload }, { headers: SessionService.getSessionHeader() })
      .map(res => {
        if (res.json().success) {
          return fromUserInviteActions.userInviteSuccess(action.payload);
        } else {
          return fromUserInviteActions.userInviteFailure(res.json().errors);
        }
      })
      .catch(e => Observable.of(fromUserInviteActions.userInviteFailure(['unknown'])))
  );
}
