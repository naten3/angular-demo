import { Component, Input, Output,
   ChangeDetectionStrategy, AfterViewInit, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { chunk } from 'lodash';

import { TreeNode } from 'app/core/models/tree';
import { UserInfo } from 'app/core/models/session';


@Component({
    selector: 'app-user-list',
    template: `
  <div class="container">
    <div class="row mb-3" *ngFor="let row of getChunkedUsers()">
      <div *ngFor="let n of row; trackBy:getUserId" class="col-md-3 col-centered">
        <div (click)=userClick.emit(n) ><app-user-item [user]="n"></app-user-item></div>
      </div>
    </div>
  </div>
  `, styles: [`
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminUserListComponent {
    @Input() users: Array<UserInfo>;
    @Output() userClick: EventEmitter<UserInfo> = new EventEmitter();

    constructor() {
    }

    getUserId(index, user: UserInfo) {
        return user.id;
    }

    getChunkedUsers(): Array<Array<UserInfo>> {
        return chunk(this.users, 3);
    }
}

