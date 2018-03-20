import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { CREATE_USER_REQUEST,
   UPDATE_USER_REQUEST,
  UPDATE_PASSWORD_REQUEST } from 'app/core/store/actions/user-update.actions';
import { SessionService } from 'app/core/services';
import * as fromAdminUserList from 'app/core/store/actions/admin-user-list.actions';
import { UserInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';

export const PAGE_SIZE = 6;

@Injectable()
export class AdminUserListEffecs {

  currentPage$: Observable<number>;

  constructor(
    private http: Http,
    private actions$: Actions,
    private store: Store<fromRoot.State>
  ) {
    this.currentPage$ = store.select(fromRoot.getAdminUserPageNumber);
  }

  @Effect() changePage$ = this.actions$
  .ofType(fromAdminUserList.INCREMENT_PAGE, fromAdminUserList.DECREMENT_PAGE)
  .switchMap(action =>
    this.currentPage$.map(p => fromAdminUserList.requestUserListPage(p))
  );

  @Effect() getPage$ = this.actions$
      .ofType(fromAdminUserList.REQUEST_USER_LIST_PAGE)
      .switchMap(action => {
        return this.http.get(`/api//admin/users?size=${PAGE_SIZE}&page=${action.payload}`, { headers: SessionService.getSessionHeader()})
        .map(res => {
            if (res.ok) {
              return fromAdminUserList.getUserListPageSuccess(action.payload, res.json());
            } else {
              return fromAdminUserList.getUserListPageFailure(res.json().errors);
            }
        })
        .catch(e => Observable.of(fromAdminUserList.getUserListPageFailure((['unknown']))));
      });
}
