import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { replace } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State } from 'app/core/models/session/session.state';
import { SessionService } from 'app/core/services';
import { invalidateSessionInfo } from 'app/core/store/actions/session.actions';

import * as fromRoot from 'app/core/store';
// pull the token off the query param quickly
@Injectable()
export class SocialLoginGuard implements CanActivate {
  hasUpdatedAuth$: Observable<boolean>;
  userInfo$: Observable<any>;
  sessionState$: Observable<State>;

  constructor(private router: Router, private store: Store<fromRoot.State>, private sessionService: SessionService) {
    this.hasUpdatedAuth$ = store.select(fromRoot.getHasFetchedSessionStatus);
    this.userInfo$ = store.select(fromRoot.getUserInfo);
    this.sessionState$ = store.select(fromRoot.getSession);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = route.queryParamMap.get('x-auth-token');
    if (!!token) {
      SessionService.saveSessionId(token);
      this.store.dispatch(invalidateSessionInfo());
      this.sessionService.getSessionStatus();
      this.store.dispatch(replace('/home'));
    } else {
      console.log('no token on request');
      this.store.dispatch(replace('/'));
    }
    return Observable.of(false);
  }
}
