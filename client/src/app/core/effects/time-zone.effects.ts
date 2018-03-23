import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/observable/concat';
import { Store } from '@ngrx/store';
import { back, go } from '@ngrx/router-store';

import { SessionService } from 'app/core/services';
import { UserInfo } from 'app/core/models/session';
import * as fromTimeZoneActions from 'app/core/store/actions/time-zone.actions';
import * as fromTimeZone from 'app/core/models/time-zone';
import * as fromRoot from 'app/core/store';

@Injectable()
export class TimeZoneEffects {
  constructor(
    private store: Store<fromRoot.State>,
    private http: Http,
    private actions$: Actions
  ) { }

  // assembles the needed data, doing nothing for fields which are correct
  @Effect() requestTimeZoneState$ = this.actions$
    .ofType(fromTimeZoneActions.REQUEST_NEW_TIME_ZONE_STATE)
    .withLatestFrom(this.store)
    .switchMap(actionWithStore => {
      const userId: number = actionWithStore[0].payload;
      // assumption: this won't be called before authentication because of route guards
      const currentUser: UserInfo = actionWithStore[1].session.userInfo;
      const currentTimeZoneUser: UserInfo = actionWithStore[1].timeZone.user;
      const currentTimeZones = actionWithStore[1].timeZone.timeZones;
      let userAction$: Observable<any>;
      if (!!currentTimeZoneUser && currentTimeZoneUser.id === userId) {
        // user is already loaded
        userAction$ = Observable.of();
      } else if (currentUser.id === userId) {
        // user is current user, no need to fetch
        userAction$ = Observable.of(fromTimeZoneActions.setTimeZoneUser(currentUser));
      } else {
        // have to fetch user
        userAction$ = Observable.of(fromTimeZoneActions.requestTimeZoneUser(userId));
      }

      let timeZoneAction$: Observable<any>;
      if ( !!currentTimeZones && currentTimeZones.userId === userId) {
        timeZoneAction$ = Observable.of();
      } else {
        timeZoneAction$ = Observable.of(fromTimeZoneActions.requestTimeZones(userId))
      }
      return concat(userAction$, timeZoneAction$);
  });

  @Effect() fetchTimeZone$ = this.actions$
  .ofType(fromTimeZoneActions.TIME_ZONE_REQUEST)
  .switchMap( action => {
    const userId: number = action.payload;
    return this.http.get(`/api/users/${userId}/time-zones`,
    { headers: SessionService.getSessionHeader()})
    .map(res => {
      if (res.ok) {
        return fromTimeZoneActions.timeZoneSuccess(userId, res.json());
      } else {
        return fromTimeZoneActions.timeZoneFailure(userId, res.json());
      }
  })
  .catch(e => Observable.of(fromTimeZoneActions.timeZoneFailure(userId, ['unknown'])));
  });

  @Effect() requestTimeZoneUser$ = this.actions$
  .ofType(fromTimeZoneActions.TIME_ZONE_USER_REQUEST)
  .switchMap(action => this.http.get(`/api/users/${action.payload}`,
  { headers: SessionService.getSessionHeader()})
  .map(res => {
      if (res.ok) {
        return fromTimeZoneActions.requestTimeZoneUserSuccess(res.json());
      } else {
        return fromTimeZoneActions.requestTimeZoneUserFailure(action.payload);
      }
  })
  .catch(e => Observable.of(fromTimeZoneActions.requestTimeZoneUserFailure(action.payload))));
}
