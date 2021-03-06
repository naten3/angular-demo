import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { replace } from '@ngrx/router-store';

import { State } from 'app/core/models/session/session.state';

import * as fromRoot from 'app/core/store';
// make sure we're authenticated before hitting a route
@Injectable()
export class AuthGuard implements CanActivate {
  hasUpdatedAuth$: Observable<boolean>;
  userInfo$: Observable<any>;
  sessionState$: Observable<State>;

  constructor(private router: Router, private store: Store<fromRoot.State>) {
    this.hasUpdatedAuth$ = store.select(fromRoot.getHasFetchedSessionStatus);
    this.userInfo$ = store.select(fromRoot.getUserInfo);
    this.sessionState$ = store.select(fromRoot.getSession);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.sessionState$
      .pipe(
        filter(s => {
          return (s as State).hasFetchedStatus;
        })
      )
      .map(s => {
        if (!!(s as State).userInfo) {
          return true;
        } else {
          console.log('user is not logged in, navigating to login page');
          this.store.dispatch(replace('/'));
          return false;
        }
      });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}
