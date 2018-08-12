import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { take, filter, tap } from 'rxjs/operators';

import * as fromRoot from 'app/core/store';
import * as fromAdminUserListActions from 'app/core/store/actions/admin-user-list.actions';
import * as fromAdminUserList from 'app/core/models/admin-user-list';

// Get the admin user list before activating
@Injectable()
export class UserAdminListResolver implements Resolve<fromAdminUserList.State> {
  constructor(private store: Store<fromRoot.State>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<fromAdminUserList.State> {
    return this.store
      .select(fromRoot.getAdminUserList)
      .pipe(
        tap(als => {
          const adminUserListState = als as fromAdminUserList.State;
          if (!adminUserListState.userPage || adminUserListState.userPage.number !== adminUserListState.page) {
            this.store.dispatch(fromAdminUserListActions.requestUserListPage(adminUserListState.page));
          }
        })
      )
      .pipe(take(5))
      .pipe(filter(x => !!(x as fromAdminUserList.State).userPage))
      .pipe(take(1));
  }
}
