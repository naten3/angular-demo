import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import * as fromRoot from 'app/core/store';
import { UpdateUserComponent } from './';
import { checkIfAdmin } from 'app/core/models/session';
import { filterNotNull } from 'app/core/utils/rx-utils';

import { Http } from '@angular/http';

@Component({
  templateUrl: './update-user.component.html'
})
export class AdminUserUpdateComponent extends UpdateUserComponent {
  static getUserId(route: ActivatedRoute): number {
    return Number(route.snapshot.params['userId']);
  }

  constructor(store: Store<fromRoot.State>, route: ActivatedRoute, http: Http) {
    super(store, filterNotNull(store.select(fromRoot.getCurrentlyManagedUser)), AdminUserUpdateComponent.getUserId(route), http);

    this.canDeleteUser$ = store.select(fromRoot.getUserInfo).map(ui => !!ui && ui.id !== AdminUserUpdateComponent.getUserId(route));

    this.isDeletedUser$ = store
      .select(fromRoot.getAdminDeletedUsers)
      .map(deletedUsers => deletedUsers.has(AdminUserUpdateComponent.getUserId(route)));

    this.canViewUserTimeZones$ = store.select(fromRoot.getUserInfo).map(ui => !!ui && checkIfAdmin(ui));
  }
}
