import {Http, Headers, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from 'app/core/store';
import 'rxjs/add/operator/map';

import * as sessionActions from 'app/core/store/actions/session.actions';
import { initialState } from 'app/core/models/session/session.state';

const BASE_URL = '/api/session/';
const SESSION_ID_KEY = 'SESSION_ID';
const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class SessionService {

  constructor(private http: Http, private store: Store<fromRoot.State> ) {
  }

  getSessionStatus() {
    const sessionId = this.getSessionId();
    if (!sessionId) {
        this.store.dispatch({
            type: sessionActions.SESSION_INFO_UPDATE,
            payload: initialState
        });
    } else {
        this.http.get(BASE_URL + 'status', {headers: this.getSessionHeader()})
        .map(res => {
            if (res.status === 403) {
                return { type: sessionActions.SESSION_INFO_UPDATE,
                payload: null };
            } else if (!res.ok) {
                return { type: sessionActions.REQUEST_STATUS_ERROR };
            } else {
                return { type: sessionActions.SESSION_INFO_UPDATE,
                    payload: res.json() };
            }
        }).subscribe(action => this.store.dispatch(action));
    }
  }

  initSession(name: string) {
      const params: URLSearchParams = new URLSearchParams();
      params.append('name', name);

    this.http.get(BASE_URL + 'init', {params}).subscribe(response => {
        this.saveSessionId(response.json().id);
        this.getSessionStatus();
    });
  }

  saveSessionId(id: string) {
      localStorage.setItem(SESSION_ID_KEY, id);
  }

  getSessionId(): string | null {
      return localStorage.getItem(SESSION_ID_KEY);
  }

  public getSessionHeader(): Headers {
      const headers: Headers = new Headers();
      headers.append('x-auth-token', this.getSessionId());
      return headers;
  }
}
