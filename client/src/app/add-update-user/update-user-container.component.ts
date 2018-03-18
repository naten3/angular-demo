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

export class UpdateUserComponent implements OnDestroy{
  modalTitle = 'Update';
  success$: Observable<boolean>;
  submitted$: Observable<boolean>;
  pendingUpdate$: Observable<boolean>;
  errors$: Observable<Array<string>>;

  passwordModel: any = {};
  model: any = {};
  formDataSubcription: Subscription;

  constructor( private store: Store<fromRoot.State>, private currentFormData$: Observable<UserUpdateForm>,
  private userId: number) {
      this.success$ = store.select(fromRoot.getUserUpdateSuccess);
      this.submitted$ = store.select(fromRoot.getUserUpdateSubmitted);
      this.pendingUpdate$ = store.select(fromRoot.getUserUpdatePending);
      this.errors$ = store.select(fromRoot.getUserSaveErrors)
      .map(codes => codes.map(this.mapErrorCodeToMessage));

      this.formDataSubcription = currentFormData$.subscribe(fd => {
        this.model.firstName = fd.firstName;
        this.model.lastName = fd.lastName;
      });
  }

  // TODO some indication when save succeeds
  save(value: any) {
      const form: UserUpdateForm = {
        firstName: this.model.firstName,
        lastName: this.model.lastName
      };
      this.store.dispatch(updateUser({
        userId: this.userId,
        userUpdateForm: form
      }));
  }

  updatePassword(pf) {
    
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

  ngOnDestroy() {
    this.formDataSubcription.unsubscribe();
  }
}
