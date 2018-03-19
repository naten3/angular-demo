import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/timer';
import { go } from '@ngrx/router-store';

import { State } from 'app/core/models/app.state';
import { UserInfo } from 'app/core/models/session';
import * as saveActions from 'app/core/store/actions/save.actions';
import * as sessionActions from 'app/core/store/actions/session.actions';
import * as fromRoot from 'app/core/store';
@Component({
    selector: 'app-home',
    template: `

  <nav class="navbar navbar-default">
    <div class="container-fluid">
    <h2>
    <img id="homeProfileImage" [src]="profileUrl$ | async">
    <span>Welcome {{firstName$ | async}}!</span>
    <button (click)="logout()" class="btn btn-primary">Logout</button>
    </h2>
      <div class="navbar-header">
        <a class="navbar-brand" href="#">NgRx-Store-Sample-App</a>
      </div>
      <ul class="nav navbar-nav">
        <li routerLinkActive="active" [routerLink]="['users/me/update']" 
        routerLinkActiveOptions="{exact:true}"><a>Update My Profile</a></li>
        <li routerLinkActive="active" routerLinkActiveOptions="{exact:true}" [routerLink]="['admin/users']"><a>User List</a></li>
        <li routerLinkActive="active" [routerLink]="['tree']" routerLinkActiveOptions="{exact:true}"><a>Tree</a></li>
        <li routerLinkActive="active" routerLinkActiveOptions="{exact:true}" [routerLink]="['todo']"><a>Todo</a></li>
      </ul>
    </div>
  </nav>
<router-outlet></router-outlet>
`
})

export class HomeContainerComponent implements OnDestroy {
    appState: fromRoot.State;
    stateFromStore: any;
    onSave$: Subject<any> = new Subject<any>();
    appState$: Observable<State>;
    loading$: Observable<boolean>;
    userInfo$: Observable<UserInfo>;
    profileUrl$: Observable<string>;
    firstName$: Observable<string>;
    _key$: any;
    _onSave$: any;
    constructor(
        private route: ActivatedRoute,
        private store: Store<fromRoot.State>
    ) {
      this.userInfo$ = store.select(fromRoot.getUserInfo);
      this.profileUrl$ = this.userInfo$
      .pipe(filter(u => !!u))
      .map(u => {
        const user = u as UserInfo;
        return user.profileImage || user.socialProfileImage;
      });

      this.firstName$ = this.userInfo$
      .pipe(filter(u => !!u))
      .map(u => (u as UserInfo).firstName);
    }

    ngOnDestroy() {
        if (this._key$) {
            this._key$.unsubscribe();
        }

    }

    logout() {
      this.store.dispatch(sessionActions.logout());
    }

}


