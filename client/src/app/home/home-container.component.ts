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
import { UserInfo, getDisplayProfileImage } from 'app/core/models/session';
import * as saveActions from 'app/core/store/actions/save.actions';
import * as sessionActions from 'app/core/store/actions/session.actions';
import * as fromRoot from 'app/core/store';
@Component({
    selector: 'app-home',
    template: `


  <div class="row page-header">
    <img id="homeProfileImage" [src]="profileUrl$ | async">
    <h2 id="welcomeMessage">Welcome {{firstName$ | async}}!</h2>
    <button (click)="logout()" class="btn btn-primary">Logout</button>
  </div>
      <ul class="nav nav-pills nav-justified">
        <li routerLinkActive="active" [routerLink]="['users/me/update']" 
        routerLinkActiveOptions="{exact:true}" class="nav-link"><a>Update My Profile</a></li>
        <li routerLinkActive="active" routerLinkActiveOptions="{exact:true}" 
        [routerLink]="['admin/users']" class="nav-link"><a>Manage Users</a></li>
        <li routerLinkActive="active" routerLinkActiveOptions="{exact:true}" 
        [routerLink]="['admin/invite-user']" class="nav-link"><a>Invite New User</a></li>
      </ul>

<router-outlet></router-outlet>
`, styles: [`
  #homeProfileImage { margin: 0 2em;}
  #welcomeMessage { margin: 0 2em;}
`]
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
      .map(getDisplayProfileImage);

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


