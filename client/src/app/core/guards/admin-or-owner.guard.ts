import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { replace } from '@ngrx/router-store';

import { State } from 'app/core/models/session/session.state';
import { checkIfAdmin } from 'app/core/models/session';

import * as fromRoot from 'app/core/store';
// Make sure the user is an ADMIN or owns the resource,
// looks or 'userId' router param
@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
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
          const userInfo = (s as State).userInfo;
          if (checkIfAdmin(userInfo) || userInfo.id === Number(route.params['userId'])) {
            return true;
          } else {
            console.log('user does not have appropriate role, navigating home');
            this.store.dispatch(replace('/home'));
            return false;
          }
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
