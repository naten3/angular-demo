import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as treeActions from 'app/core/store/actions/tree.actions';
import * as fromRoot from 'app/core/store';
import { UserInfo } from 'app/core/models/session';

@Component({
    selector: 'app-tree-container',
    template: `
    
    <fieldset tabindex="-1">
        <legend >All Users</legend>
            <div >
                <app-user-list  [users]="users$ | async">
                </app-user-list>
            </div>
    </fieldset>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
    , styles: [`
 :focus { outline: none }
        `]
})
export class UserListContainerComponent {

    pageNumber$: Observable<number>;
    users$: Observable<Array<UserInfo>>;

    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.pageNumber$ = store.select(fromRoot.getAdminUserPageNumber);
        this.users$ = store.select(fromRoot.getAdminUserPage).map(page => page.content);
    }
}

