import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { mergeMap } from 'rxjs/operators';

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
  .withLatestFrom(this.store)
  .map( actionWithState => {
    return fromAdminUserList.requestUserListPage(actionWithState[1].adminUserList.page); });

  @Effect() manageUser$ = this.actions$
  .ofType(fromAdminUserList.MANAGE_USER)
  .map(action => go(`home/admin/users/${action.payload.id}/update`));

  @Effect() getPage$ = this.actions$
      .ofType(fromAdminUserList.REQUEST_USER_LIST_PAGE)
      .switchMap(action => {
        return this.getUserPage(action.payload)
        .map(res => {
            if (res.ok) {
              return fromAdminUserList.getUserListPageSuccess(action.payload, res.json());
            } else {
              return fromAdminUserList.getUserListPageFailure(res.json().errors);
            }
        })
        .catch(e => Observable.of(fromAdminUserList.getUserListPageFailure((['unknown']))));
      });


  getUserPage = (pageNumber: number) => this.http.get(`/api//admin/users?size=${PAGE_SIZE}&page=${pageNumber}`,
   { headers: SessionService.getSessionHeader()});
}
