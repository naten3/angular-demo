import { Component, Input } from '@angular/core';
import 'rxjs/add/observable/of';

import { UserInfo, getDisplayProfileImage, ROLE_ADMIN, ROLE_USER_ADMIN, ROLE_USER } from 'app/core/models/session';

@Component({
  selector: 'app-user-item',
  template: `
    <div class="card" style="width: 12rem;">
    <img class="card-img-top" [src]="getDisplayImage()" alt="profile image">
    <div class="card-body">
      <div>
      <h6 class="card-title m-0">{{user.firstName}} {{user.lastName}}</h6>
      </div>
      <div *ngIf="user.accountLocked" class="bg-danger">
        LOCKED
      </div>
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
      <li class="list-group-item">
        <dl>
          <dt>Email Verified</dt>
          <dd>{{emailVerifiedString()}}</dd>
        </dl>
      </li>
    </ul>
  </div>
  `,
  styles: [
    `
      ul {
        list-style-type: none;
      }
      dl {
        margin: 0;
      }
      dt {
        font-size: 8pt;
      }
      dd {
        font-size: 8pt;
      }
      .card-body {
        padding: 4px;
      }
      .list-group-item {
        padding: 3px 5px;
      }
      .card-img-top {
        object-fit: cover;
      }
      .selected {
        background-color: yellow;
      }
      .focused {
        outline: 1px dashed red;
      }
      :focus {
        outline: none;
      }
      .card-img-top {
        height: 12rem;
        width: 100%;
      }
    `
  ]
})
export class UserItemComponent {
  @Input()
  user: UserInfo;

  getDisplayImage(): string {
    return getDisplayProfileImage(this.user);
  }

  getRole(): string {
    return this.user.roles
      .map(r => {
        if (r === ROLE_ADMIN) {
          return 'Admin';
        } else if (r === ROLE_USER_ADMIN) {
          return 'User Admin';
        } else if (r === ROLE_USER) {
          return 'User';
        } else {
          return '';
        }
      })
      .filter(r => !!r)
      .join(',');
  }

  emailVerifiedString(): string {
    return this.user.emailVerified ? 'Yes' : 'No';
  }
}
