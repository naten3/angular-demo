import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { take, filter, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { UserInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';
import * as fromTimeZoneActions from 'app/core/store/actions/time-zone.actions';
import * as fromTimeZone from 'app/core/models/time-zone';

// Get time zone state
@Injectable()
export class TimeZoneResolver implements Resolve<any> {

    constructor(
        private store: Store<fromRoot.State>
      ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> {
        const routeUserId = Number(route.params['userId']);
        return this.store.select(fromRoot.getTimeZoneState)
        .pipe(tap(state => {
            const timeZoneState = state as fromTimeZone.State;
            if (timeZoneState.fetchErrors) {
              Observable.throw('error getting user');
            }
            if (!this.stateIsResolved(timeZoneState, routeUserId)) {
              this.store.dispatch(
                fromTimeZoneActions.requestNewTimeZoneState(routeUserId));
            }
        }))
        .pipe(take(5))
        .pipe(filter(x => this.stateIsResolved(x as fromTimeZone.State, routeUserId)))
        .pipe(take(1))
        .catch(err => {
          this.store.dispatch(fromTimeZoneActions.timeZoneReset());
          this.store.dispatch(fromRouter.go('not-found'));
          return Observable.of(null);
        });
    }

    stateIsResolved(state: fromTimeZone.State, userId: number): boolean {
      return !!state.user && state.user.id === userId
            && !!state.timeZones && state.timeZones.userId === userId;
    }
}
