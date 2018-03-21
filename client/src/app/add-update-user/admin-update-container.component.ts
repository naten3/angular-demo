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
  export class SelfUpdateComponent extends UpdateUserComponent {

    static getUserId(route: ActivatedRoute): number {
      return Number(route.snapshot.data['userId']);
    }

    constructor( store: Store<fromRoot.State>, route: ActivatedRoute, http: Http) {
      super(store,
        store.select(fromRoot.getCurrentlyManagedUser),
        SelfUpdateComponent.getUserId(route),
        http);
    }
  }
