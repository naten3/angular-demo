import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import * as fromRoot from 'app/core/store';
import { UserSaveRequest } from 'app/core/models/user-save';
import { createUser } from 'app/core/store/actions/user-update.actions';

@Component({
  templateUrl: './add-user.component.html'
})
export class AddUserComponent {
  modalTitle = 'Register';
  success$: Observable<boolean>;
  submitted$: Observable<boolean>;
  pendingUpdate$: Observable<boolean>;
  errors$: Observable<Array<string>>;
  isAdmin$: Observable<boolean>;

  model: any = {};

  constructor( private store: Store<fromRoot.State>) {
      this.success$ = store.select(fromRoot.getUserSaveSuccess);
      this.submitted$ = store.select(fromRoot.getUserSaveSubmitted);
      this.pendingUpdate$ = store.select(fromRoot.getUserSavePending);
      this.errors$ = store.select(fromRoot.getUserSaveErrors);
  }

  save(value: any) {
      const userSaveRequest = new UserSaveRequest;
      userSaveRequest.email = value.email;
      userSaveRequest.username = value.username;
      userSaveRequest.password = value.password;

      this.store.dispatch(createUser(userSaveRequest));
  }

  goToLogin() {
    this.store.dispatch(fromRouter.go('/'));
  }
}
