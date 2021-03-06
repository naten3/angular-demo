import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { LocalStorageService } from '../../services';
import * as fromSave from '../actions/save.actions';

@Injectable()
export class SaveEffects {
  @Effect()
  save$: Observable<Action> = this.actions$
    .ofType(fromSave.SAVE_APP_STATE)
    .map(toPayload)
    .switchMap(state => this.localStorageService.saveAppState(state))
    .map(o => fromSave.saveAppStateSuccess(o))
    .catch(e => of(fromSave.saveAppStateFail(e)));
  constructor(private actions$: Actions, private localStorageService: LocalStorageService) {}
}
