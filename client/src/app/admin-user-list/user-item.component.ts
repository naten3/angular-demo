import { Component, Input, OnInit, ChangeDetectionStrategy, 
    OnChanges, AfterViewInit, ElementRef,
     ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TreeEvents } from 'app/tree/tree-events';
import { SourceType } from 'app/core/models/tree';
import { Subscription } from 'rxjs/Subscription';

import { getDisplayProfileImage, ROLE_ADMIN, ROLE_USER_ADMIN, 
    ROLE_USER } from 'app/core/models/session';
import { UserInfo } from 'app/core/models/session';

@Component({
    selector: 'app-user-item',
    template: `
    <div class="card" style="width: 12rem;">
    <img class="card-img-top" [src]="getDisplayImage()" alt="profile image">
    <div class="card-body">
      <h6 class="card-title">{{user.firstName}} {{user.lastName}}</h6>
    </div>
    <ul class="list-group list-group-flush">
      
      <li class="list-group-item">
        <dl>
          <dt>Email</dt>
          <dd>{{user.email}}</dd>
        </dl>
      </li>
      <li class="list-group-item">
        <dl>
          <dt>Username</dt>
          <dd>{{user.username}}</dd>
        </dl>
      </li>
      <li class="list-group-item">
      <dl>
        <dt>Role</dt>
        <dd>{{getRole()}}</dd>
      </dl>
    </li>
    </ul>
  </div>
  `, styles: [`
        ul {list-style-type: none;}
        dt {font-size: 8pt}
        dd {font-size: 8pt}
        .list-group-item {padding: 5px 10px}
        .card-img-top {object-fit: cover;}
        .selected {background-color: yellow}
        .focused { outline: 1px dashed red; }
        :focus {outline:none}
        .card-img-top { height: 12rem; width: 100%; }
        `]
})

export class UserItemComponent {
    @Input() user: UserInfo;

    getDisplayImage(): string {
        return getDisplayProfileImage(this.user);
    }

    getRole(): string {
        return this.user.roles.map(r => {
            if (r === ROLE_ADMIN) {
                return 'Admin';
            } else if (r === ROLE_USER_ADMIN) {
                return 'User Admin';
            } else if (r === ROLE_USER) {
                return 'User';
            } else {
                return '';
            }
        }).filter(r => !!r).join(',');
    }
}

