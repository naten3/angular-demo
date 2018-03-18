import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { LOGIN, LOGIN_STATUS_CHANGE } from 'app/core/store/actions/session.actions'
import { SessionService } from 'app/core/services';

@Injectable()
export class AuthEffects {
  constructor(
    private http: Http,
    private actions$: Actions
  ) { }

  @Effect() login$ = this.actions$
      // Listen for the 'LOGIN' action
      .ofType(LOGIN)
      .switchMap(action => {
        const body = new URLSearchParams();
        body.set('username', action.payload.username);
        body.set('password', action.payload.password);

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post('/api/login', body.toString(), { headers: headers })
        // If successful, dispatch success action with result
        .map(res => {
            SessionService.saveSessionId(res.headers.get('x-auth-token'));
            return { type: LOGIN_STATUS_CHANGE, payload: res.json() };
        })
        // If request fails, dispatch failed action
        .catch(() => Observable.of({ type: 'LOGIN_FAILED' }))
      });
}