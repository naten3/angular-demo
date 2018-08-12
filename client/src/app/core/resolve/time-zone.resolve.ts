import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
  constructor(private store: Store<fromRoot.State>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const routeUserId = Number(route.params['userId']);

    const timeZoneUser$ = combineLatest(this.store.select(fromRoot.getTimeZoneUser), this.store.select(fromRoot.getTimeZoneHasErrors))
      .map(tzuWithHasErrors => {
        if (tzuWithHasErrors[1]) {
          Observable.throw('Error getting time zone state');
        } else {
          return tzuWithHasErrors[0];
        }
      })
      .pipe(
        tap(tzu => {
          const timeZoneUser: UserInfo = tzu as UserInfo;
          if (!timeZoneUser || timeZoneUser.id !== routeUserId) {
            this.store.dispatch(fromTimeZoneActions.requestTimeZoneUser(routeUserId));
          }
        })
      )
      .pipe(filter(timeZoneUser => !!timeZoneUser && (timeZoneUser as UserInfo).id === routeUserId));

    const timeZones$ = combineLatest(this.store.select(fromRoot.getUserTimeZones), this.store.select(fromRoot.getTimeZoneHasErrors))
      .map(tzWithHasErrors => {
        if (tzWithHasErrors[1]) {
          Observable.throw('Error getting time zone state');
        } else {
          return tzWithHasErrors[0];
        }
      })
      .pipe(
        tap(tz => {
          const userTimeZones: fromTimeZone.UserTimeZones = tz as fromTimeZone.UserTimeZones;
          if (!userTimeZones || userTimeZones.userId !== routeUserId) {
            this.store.dispatch(fromTimeZoneActions.requestTimeZones(routeUserId));
          }
        })
      )
      .pipe(filter(userTimeZones => !!userTimeZones && (userTimeZones as fromTimeZone.UserTimeZones).userId === routeUserId));

    return combineLatest(timeZoneUser$, timeZones$)
      .pipe(take(1))
      .catch(err => {
        this.store.dispatch(fromTimeZoneActions.timeZoneReset());
        this.store.dispatch(fromRouter.go('not-found'));
        return Observable.of(null);
      });
  }

  stateIsResolved(state: fromTimeZone.State, userId: number): boolean {
    return !!state.user && state.user.id === userId && !!state.timeZones && state.timeZones.userId === userId;
  }
}
