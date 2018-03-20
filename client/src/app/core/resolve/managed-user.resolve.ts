import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { take, filter, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';


import { UserInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';
import * as fromAdminUserListActions from 'app/core/store/actions/admin-user-list.actions';
import * as fromAdminUserList from 'app/core/models/admin-user-list';

// Get the admin user list before activating
@Injectable()
export class ManagedUserResolver implements Resolve<number> {

    constructor(
        private store: Store<fromRoot.State>
      ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> {
        const routeUserId = Number(route.params['userId']);
        return this.store.select(fromRoot.getCurrentlyManagedUser)
        .pipe(tap(cmu => {
            const managedUser = cmu as UserInfo;
            if (!managedUser ||
                managedUser.id !== routeUserId) {
                this.store.dispatch(
                    fromAdminUserListActions.requestManagedUser(routeUserId));
            }
        }))
        .pipe(filter(x => !!x && routeUserId === (x as UserInfo).id))
        .pipe(take(1));
    }
}
