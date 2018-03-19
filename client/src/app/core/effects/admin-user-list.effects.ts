import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { CREATE_USER_REQUEST,
   UPDATE_USER_REQUEST,
  UPDATE_PASSWORD_REQUEST } from 'app/core/store/actions/user-update.actions';
import { SessionService } from 'app/core/services';
import * as fromAdminUserList from 'app/core/store/actions/admin-user-list.actions';
import { UserInfo } from 'app/core/models/session';

@Injectable()
export class AdminUserListEffecs {
  constructor(
    private http: Http,
    private actions$: Actions
  ) { }

  @Effect() changePage$ = this.actions$
  .ofType(fromAdminUserList.CHANGE_PAGE)
  .map(action => fromAdminUserList.requestUserListPage(action.payload));

  @Effect() getPage$ = this.actions$
      .ofType(fromAdminUserList.REQUEST_USER_LIST_PAGE)
      .switchMap(action => {
        return this.http.get(`/api//admin/users?page=${action.payload}`, { headers: SessionService.getSessionHeader()})
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
