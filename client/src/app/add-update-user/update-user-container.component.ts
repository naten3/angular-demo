import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild , Input} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import * as fromRoot from 'app/core/store';
import { UserInfo } from 'app/core/models/session';
import { UserUpdateForm } from 'app/core/models/user-update';
import { updateUser } from 'app/core/store/actions/user-update.actions';

@Component({
  templateUrl: './add-user.component.html'
})
export class UpdateUserComponent {
  modalTitle = 'Update';
  success$: Observable<boolean>;
  submitted$: Observable<boolean>;
  pendingUpdate$: Observable<boolean>;
  errors$: Observable<Array<string>>;

  model: any = {};

  constructor( private store: Store<fromRoot.State>, private initialForm: Observable<UserUpdateForm>,
  private userId: number) {
      this.success$ = store.select(fromRoot.getUserSaveSuccess);
      this.submitted$ = store.select(fromRoot.getUserSaveSubmitted);
      this.pendingUpdate$ = store.select(fromRoot.getUserSavePending);
      this.errors$ = store.select(fromRoot.getUserSaveErrors)
      .map(codes => codes.map(this.mapErrorCodeToMessage));
  }

  save(value: any) {
      this.store.dispatch(updateUser(this.userId));
  }

  back() {
    this.store.dispatch(fromRouter.go('/'));
  }

  private mapErrorCodeToMessage(errorCode: string): string {
    switch (errorCode) {
      default:
      return 'There was an error with user update';
    }
  }
}
