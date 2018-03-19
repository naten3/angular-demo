import { Component, Input, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TreeNode } from 'app/core/models/tree';
import { UserInfo } from 'app/core/models/session';


@Component({
    selector: 'app-user-list',
    template: `
  <ul>
    <li *ngFor="let n of users; trackBy:getUserId" style="list-style: none">
        <app-user-item [user]="n"></app-user-item>
    </li>
  </ul>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminUserListComponent {
    @Input() users: Array<UserInfo>;

    constructor() {
    }

    getUserId(index, user: UserInfo) {
        return user.id;
    }
}

