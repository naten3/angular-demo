import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { go } from '@ngrx/router-store';

import * as fromSessionActions from 'app/core/store/actions/session.actions';
import { SessionService } from 'app/core/services';
import { INVALID_CREDENTIALS } from 'app/core/models/session';

@Injectable()
export class AuthEffects {
  constructor(private http: Http, private actions$: Actions) {}

  @Effect()
  login$ = this.actions$
    // Listen for the 'LOGIN' action
    .ofType(fromSessionActions.LOGIN)
    .switchMap(action => {
      const body = new URLSearchParams();
      body.set('username', action.payload.username);
      body.set('password', action.payload.password);

      const headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return (
        this.http
          .post('/api/login', body.toString(), { headers: headers })
          // If successful, dispatch success action with result
          .map(res => {
            SessionService.saveSessionId(res.headers.get('x-auth-token'));
            return fromSessionActions.loginStatusChange(res.json());
          })
          // If request fails, dispatch failed action
          .catch(err => Observable.of(fromSessionActions.loginFailure([INVALID_CREDENTIALS])))
      );
    });

  @Effect()
  logout$ = this.actions$.ofType(fromSessionActions.LOGOUT).switchMap(action => {
    this.http.get('/api/logout', { headers: SessionService.getSessionHeader() }).subscribe();
    SessionService.clearSessionId();
    return Observable.of(fromSessionActions.removeUser(), go('/'));
  });
}
