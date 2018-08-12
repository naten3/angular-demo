import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import * as fromRoot from 'app/core/store';
import { UpdateUserComponent } from './';
import { filterNotNull } from 'app/core/utils/rx-utils';

import { Http } from '@angular/http';

@Component({
  templateUrl: './update-user.component.html'
})
export class SelfUpdateComponent extends UpdateUserComponent {
  static getUserId(route: ActivatedRoute): number {
    return Number(route.snapshot.data['userId']);
  }

  constructor(store: Store<fromRoot.State>, route: ActivatedRoute, http: Http) {
    super(store, filterNotNull(store.select(fromRoot.getUserInfo)), SelfUpdateComponent.getUserId(route), http);
  }
}
