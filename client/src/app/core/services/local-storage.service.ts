import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';

import { initialState } from 'app/core/models/app.state';

export function getKey() {
  return 'ngrx-app-key';
}
export const save = (k, v) => of(localStorage.setItem(k, JSON.stringify(v)));

export function getState(k) {
  return JSON.parse(localStorage.getItem(k) || null) || initialState;
}

export function getAppState() {
  return getState(getKey());
}
export const saveAppState = state => save(getKey(), state);

@Injectable()
export class LocalStorageService {
  key: string;
  getAppState(key: string) {
    this.key = key;
    return of(getState(key));
  }
  saveAppState(state) {
    return save(this.key, state);
  }
}
