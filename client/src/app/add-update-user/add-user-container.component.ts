import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromRoot from 'app/core/store';
import { UserSaveRequest } from 'app/core/models/user-save';
import { createUser } from 'app/core/store/actions/user-update.actions';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-update-user.component.html'
})
export class AddUserComponent {
  modalTitle: string;
  success$: Observable<boolean>;
  submitted$: Observable<boolean>;
  pendingUpdate$: Observable<boolean>;
  errors$: Observable<Array<string>>;
  isAdmin$: Observable<boolean>;

  constructor(private router: Router, private formBuilder: FormBuilder, private store: Store<fromRoot.State>) {
    this.modalTitle = 'Register';
      this.success$ = store.select(fromRoot.getUserSaveSuccess);
      this.submitted$ = store.select(fromRoot.getUserSaveSubmitted);
      this.pendingUpdate$ = store.select(fromRoot.getUserSavePending);
      this.errors$ = store.select(fromRoot.getUserSaveErrors);
  }

  save(value: any, valid: boolean) {
    if (valid) {
      const userSaveRequest = new UserSaveRequest;
      userSaveRequest.email = value.email;
      userSaveRequest.username = value.username;
      userSaveRequest.password = value.password;

      this.store.dispatch(createUser(userSaveRequest));
    }
  }

  goToLogin() {
    this.router.navigate(['/']);
  }
}
