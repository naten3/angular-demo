import { Http, Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from 'app/core/store';
import 'rxjs/add/operator/map';

import * as sessionActions from 'app/core/store/actions/session.actions';
import { initialState } from 'app/core/models/session/session.state';

const SESSION_ID_KEY = 'SESSION_ID';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class SessionService {
  public static saveSessionId(id: string) {
    localStorage.setItem(SESSION_ID_KEY, id);
  }

  public static clearSessionId() {
    localStorage.removeItem(SESSION_ID_KEY);
  }

  public static getSessionId(): string | null {
    return localStorage.getItem(SESSION_ID_KEY);
  }

  constructor(private http: Http, private store: Store<fromRoot.State>) {}

  getSessionStatus() {
    const sessionId = SessionService.getSessionId();
    if (!sessionId) {
      this.store.dispatch({
        type: sessionActions.LOGIN_STATUS_CHANGE,
        payload: null
      });
    } else {
      this.getSessionStatusObservable()
        .map(res => {
          if (!res.ok) {
            SessionService.clearSessionId();
            return {
              type: sessionActions.LOGIN_STATUS_CHANGE,
              payload: null
            };
          } else {
            return {
              type: sessionActions.LOGIN_STATUS_CHANGE,
              payload: res.json()
            };
          }
        })
        .catch(err => {
          SessionService.clearSessionId();
          return Observable.of({
            type: sessionActions.LOGIN_STATUS_CHANGE,
            payload: null
          });
        })
        .subscribe(action => this.store.dispatch(action));
    }
  }

  public getSessionStatusObservable() {
    return this.http.get('/api/user/me', { headers: SessionService.getSessionHeader() });
  }

  /* tslint:disable member-ordering*/
  public static getSessionHeader(): Headers {
    const headers: Headers = new Headers();
    headers.append('x-auth-token', SessionService.getSessionId());
    return headers;
  }
}
