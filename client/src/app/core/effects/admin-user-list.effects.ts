import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { mergeMap } from 'rxjs/operators';

import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';
import { SessionService } from 'app/core/services';
import * as fromAdminUserList from 'app/core/store/actions/admin-user-list.actions';
import { UserInfo } from 'app/core/models/session';
import { Page } from 'app/core/models/common';
import * as fromRoot from 'app/core/store';

export const PAGE_SIZE = 6;

@Injectable()
export class AdminUserListEffecs {
  currentPage$: Observable<number>;

  constructor(private http: Http, private actions$: Actions, private store: Store<fromRoot.State>) {
    this.currentPage$ = store.select(fromRoot.getAdminUserPageNumber);
  }

  @Effect()
  changePage$ = this.actions$
    .ofType(fromAdminUserList.INCREMENT_PAGE, fromAdminUserList.DECREMENT_PAGE)
    .withLatestFrom(this.store)
    .map(actionWithState => {
      return fromAdminUserList.requestUserListPage(actionWithState[1].adminUserList.page);
    });

  @Effect()
  getPage$ = this.actions$.ofType(fromAdminUserList.REQUEST_USER_LIST_PAGE).switchMap(action => {
    return this.getUserPage(action.payload)
      .map(res => {
        if (res.ok) {
          return fromAdminUserList.getUserListPageSuccess(action.payload, res.json());
        } else {
          return fromAdminUserList.getUserListPageFailure(res.json().errors);
        }
      })
      .catch(e => Observable.of(fromAdminUserList.getUserListPageFailure(['unknown'])));
  });

  getUserPage = (pageNumber: number) =>
    this.http.get(`/api/admin/users?size=${PAGE_SIZE}&page=${pageNumber}`, {
      headers: SessionService.getSessionHeader()
    });

  @Effect()
  manageUser$ = this.actions$.ofType(fromAdminUserList.MANAGE_USER).map(action => go(`home/admin/users/${action.payload.id}/update`));

  @Effect()
  requestManagedUser$ = this.actions$.ofType(fromAdminUserList.REQUEST_MANAGED_USER).switchMap(action =>
    this.http
      .get(`/api/users/${action.payload}`, {
        headers: SessionService.getSessionHeader()
      })
      .map(res => {
        if (res.ok) {
          return fromAdminUserList.requestManagedUserSucces(res.json());
        } else {
          return fromAdminUserList.requestManagedUserFailure(action.payload);
        }
      })
      .catch(e => Observable.of(fromAdminUserList.requestManagedUserFailure(action.payload)))
  );

  @Effect()
  refreshPage$ = this.actions$
    .ofType(fromUserUpdate.DELETE_USER_SUCCESS)
    .withLatestFrom(this.store)
    .switchMap(actionWithStore => {
      const page: Page<UserInfo> = actionWithStore[1].adminUserList.userPage;
      const userId = actionWithStore[0].payload;
      if (!!page && !!page.content.find(x => x.id === userId)) {
        // user is on current page
        if (page.numberOfElements === 1) {
          if (page.number === 0) {
            // we removed the last user
            return Observable.of();
          } else {
            // we emptied the page go back one
            return Observable.of(fromAdminUserList.decrementPage());
          }
        } else {
          // just refresh the page
          return Observable.of(fromAdminUserList.requestUserListPage(actionWithStore[1].adminUserList.page));
        }
      } else {
        return Observable.of();
      }
    });
}
