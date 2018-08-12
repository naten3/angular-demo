import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import * as fromRoot from 'app/core/store';
import * as adminUserListActions from 'app/core/store/actions/admin-user-list.actions';
import { Page } from 'app/core/models/common';
import { UserInfo } from 'app/core/models/session';

@Component({
  selector: 'app-tree-container',
  template: `
    
    <fieldset tabindex="-1">
        <legend >Page {{displayPageNumber$ | async}} of {{totalPages$ | async}}  
        <button class="btn btn-primary" [disabled]="first$ | async" (click)="previous()" >&laquo; Previous</button>
        <button class="btn btn-primary" [disabled]="last$ | async" (click)="next()">Next &raquo;</button></legend>
            <div >
                <app-user-list  (userClick)="manageUser($event)" [users]="users$ | async">
                </app-user-list>
            </div>
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :focus {
        outline: none;
      }
    `
  ]
})
export class UserListContainerComponent {
  pageNumber$: Observable<number>;
  displayPageNumber$: Observable<number>;
  users$: Observable<Array<UserInfo>>;
  totalPages$: Observable<number>;
  first$: Observable<boolean>;
  last$: Observable<boolean>;

  userClick: EventEmitter<UserInfo> = new EventEmitter();

  constructor(private store: Store<fromRoot.State>) {
    this.pageNumber$ = store.select(fromRoot.getAdminUserPageNumber);
    this.displayPageNumber$ = this.pageNumber$.map(x => x + 1);
    const nonNullPage$: Observable<Page<UserInfo>> = store.select(fromRoot.getAdminUserPage).pipe(filter(x => !!x));
    this.users$ = nonNullPage$.map(p => p.content);
    this.totalPages$ = nonNullPage$.map(p => p.totalPages);
    this.first$ = this.pageNumber$.map(p => p === 0);
    this.last$ = combineLatest(this.pageNumber$, this.totalPages$).map(ar => ar[0] === ar[1] - 1);
  }

  next() {
    this.store.dispatch(adminUserListActions.incrementPage());
  }

  previous() {
    this.store.dispatch(adminUserListActions.decrementPage());
  }

  manageUser(userInfo: UserInfo) {
    this.store.dispatch(adminUserListActions.manageUser(userInfo));
  }
}
