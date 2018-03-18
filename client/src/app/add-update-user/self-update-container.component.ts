import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild , Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import * as fromRoot from 'app/core/store';
import { UpdateUserComponent } from './';
import { UserUpdateForm } from 'app/core/models/user-update';
import { UserInfo } from 'app/core/models/session';

@Component({
    templateUrl: './update-user.component.html'
  })
  export class SelfUpdateComponent extends UpdateUserComponent {

    static getInitialUserForm(store: Store<fromRoot.State>): Observable<UserUpdateForm> {
      return store.select(fromRoot.getUserInfo).map(userInfo => {
        return {
          password: null,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName};
        });
    }

    static getUserId(route: ActivatedRoute): number {
      return route.snapshot.data['userId'];
    }

    constructor( store: Store<fromRoot.State>, route: ActivatedRoute) {
      super(store,
        SelfUpdateComponent.getInitialUserForm(store),
        SelfUpdateComponent.getUserId(route));
    }
  }
