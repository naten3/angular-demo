import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild , Input} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import * as fromRoot from 'app/core/store';
import { UpdateUserComponent } from './';
import { UserUpdateForm } from 'app/core/models/user-update';
import { UserInfo } from 'app/core/models/session';

import { Http, RequestOptions } from '@angular/http';

@Component({
    templateUrl: './update-user.component.html'
  })
  export class AdminUserUpdateComponent extends UpdateUserComponent {

    static getInitialUserForm(store: Store<fromRoot.State>): Observable<UserUpdateForm> {
       return store.select(fromRoot.getCurrentlyManagedUser).map(userInfo => {
         return {
           firstName: userInfo.firstName,
           lastName: userInfo.lastName};
         });
    }

    static getNotSocialUser(store: Store<fromRoot.State>): Observable<boolean> {
      return store.select(fromRoot.getCurrentlyManagedUser).map(userInfo => !userInfo.socialUser);
    }

    static getUserId(route: ActivatedRoute): number {
      return route.snapshot.params['userId'];
    }

    constructor( store: Store<fromRoot.State>, route: ActivatedRoute, http: Http) {
      super(store,
        AdminUserUpdateComponent.getInitialUserForm(store),
        AdminUserUpdateComponent.getUserId(route),
        AdminUserUpdateComponent.getNotSocialUser(store),
      http);
    }
  }
