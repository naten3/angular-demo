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
import * as fromToastActions from 'app/core/store/actions/toast.actions';
import * as fromSession from 'app/core/store/actions/session.actions';
import * as fromRoot from 'app/core/store';

@Injectable()
export class TimeZoneEffects {
  constructor(
    private store: Store<fromRoot.State>,
    private http: Http,
    private actions$: Actions
  ) { }

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
  .catch(e => {
    if (e.status === 401) {
      return Observable.of(fromSession.logout());
    }
    return Observable.of(fromTimeZoneActions.timeZoneFailure(userId, ['unknown']));
    });
  });

  @Effect() requestTimeZoneUser$ = this.actions$
  .ofType(fromTimeZoneActions.TIME_ZONE_USER_REQUEST)
  .withLatestFrom(this.store)
  .switchMap( actionWithStore => {
    const requestedUserId: number = actionWithStore[0].payload;
    const latestStore = actionWithStore[1];
    if (!!latestStore.session.userInfo && latestStore.session.userInfo.id === requestedUserId) {
      // it's the currently logged in user so just use that;
      return Observable.of(fromTimeZoneActions.
        requestTimeZoneUserSuccess(latestStore.session.userInfo));
    }
    return this.http.get(`/api/users/${requestedUserId}`,
    { headers: SessionService.getSessionHeader()})
    .map(res => {
      if (res.ok) {
        return fromTimeZoneActions.requestTimeZoneUserSuccess(res.json());
      } else {
        return fromTimeZoneActions.requestTimeZoneUserFailure(requestedUserId);
      }
    })
    .catch(e => {
      if (e.status === 401) {
        return Observable.of(fromSession.logout());
      }
      return Observable.of(fromTimeZoneActions.requestTimeZoneUserFailure(requestedUserId));
    });
  });

  @Effect() createTimeZone$ = this.actions$
  .ofType(fromTimeZoneActions.CREATE_TIME_ZONE)
  .switchMap(action => this.http.post(`/api/users/${action.payload.userId}/time-zones`,
  action.payload.timeZone,
  { headers: SessionService.getSessionHeader()})
  .map(res => {
      if (res.ok) {
        return fromTimeZoneActions.createTimeZoneSuccess(res.json(), action.payload.userId);
      } else {
        return fromTimeZoneActions.requestTimeZoneUserFailure(action.payload.userId);
      }
  })
  .catch(e => {
    if (e.status === 401) {
      return Observable.of(fromSession.logout());
    }
    return Observable.of(fromTimeZoneActions.requestTimeZoneUserFailure(action.payload.userId));
  }));

  @Effect() updateTimeZone$ = this.actions$
  .ofType(fromTimeZoneActions.UPDATE_TIME_ZONE)
  .switchMap(action => this.http.put(`/api/time-zones/${action.payload.timeZone.id}`,
  action.payload.timeZone,
  { headers: SessionService.getSessionHeader()})
  .map(res => {
      if (res.ok) {
        return fromTimeZoneActions.updateTimeZoneSuccess(res.json(), action.payload.userId);
      } else {
        return fromTimeZoneActions.updateTimeZoneFailure(action.payload.id, action.payload.userId);
      }
  })
  .catch(e => {
    if (e.status === 401) {
      return Observable.of(fromSession.logout());
    }
    return Observable.of(fromTimeZoneActions.updateTimeZoneFailure(action.payload.id, action.payload.userId));
  }));

  @Effect() deleteTimeZone$ = this.actions$
  .ofType(fromTimeZoneActions.DELETE_TIME_ZONE)
  .switchMap(action => this.http.delete(`/api/time-zones/${action.payload.id}`,
  { headers: SessionService.getSessionHeader()})
  .map(res => {
      if (res.ok) {
        return fromTimeZoneActions.deleteTimeSuccess(action.payload.id, action.payload.userId);
      } else {
        return fromTimeZoneActions.deleteTimeFailure(action.payload.id, action.payload.userId);
      }
  })
  .catch(e => {
    if (e.status === 401) {
      return Observable.of(fromSession.logout());
    }
    return Observable.of(fromTimeZoneActions.deleteTimeFailure(action.payload.id, action.payload.userId));
  }));

  @Effect() deleteTimeZoneError$ = this.actions$
  .ofType(fromTimeZoneActions.DELETE_TIME_ZONE_FAILURE)
  .map(action => fromToastActions.faillToast(`Error Deleting Time Zone`, 'Error'));

  @Effect() updateTimeZoneError$ = this.actions$
  .ofType(fromTimeZoneActions.UPDATE_TIME_ZONE_FAILURE)
  .map(action => fromToastActions.faillToast(`Error Updating Time Zone`, 'Error'));

  @Effect() createTimeZoneError$ = this.actions$
  .ofType(fromTimeZoneActions.CREATE_TIME_ZONE_FAILURE)
  .map(action => fromToastActions.faillToast(`Error Creating Time Zone`, 'Error'));

  @Effect() readTimeZoneError$ = this.actions$
  .ofType(fromTimeZoneActions.TIME_ZONE_FAILURE)
  .map(action => fromToastActions.faillToast(`Error Fetching User Time Zones`, 'Error'));
}

