import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild , Input, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { Http, RequestOptions } from '@angular/http';
import { SessionService } from 'app/core/services';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';

import * as fromRoot from 'app/core/store';
import { UserInfo, getDisplayProfileImage, isAdmin, ROLE_ADMIN, ROLE_USER, 
  ROLE_USER_ADMIN, highestLevelRole, getRoleValue } from 'app/core/models/session';
import { UserUpdateForm } from 'app/core/models/user-update';
import { updateUser, updatePassword } from 'app/core/store/actions/user-update.actions';


export abstract class UpdateUserComponent implements OnDestroy {

  canDeleteUser$ = Observable.of(false);
  canViewUserTimeZones$ = Observable.of(false);
  isDeletedUser$ = Observable.of(false);
  canUnlockUser$: Observable<boolean>;
  isUnlockPendingUpdate$: Observable<boolean>;

  isLoggedInAsAdmin$: Observable<boolean>;
  isLoggedInAsUserAdmin$: Observable<boolean>;
  success$: Observable<boolean>;
  submitted$: Observable<boolean>;
  pendingUpdate$: Observable<boolean>;
  errors$: Observable<Array<string>>;

  passwordSuccess$: Observable<boolean>;
  passwordSubmitted$: Observable<boolean>;
  passwordPendingUpdate$: Observable<boolean>;
  passwordErrors$: Observable<Array<string>>;

  passwordModel: any = {};
  model: any = {};
  formDataSub: Subscription;
  passwordSuccessSub;

  profileImage$: Observable<string>;
  notSocialUser$: Observable<boolean>;

  roles = [
    {name: 'User', code : ROLE_USER},
    {name: 'User Admin', code : ROLE_USER_ADMIN},
    {name: 'Admin', code : ROLE_ADMIN}
  ];

  @ViewChild('profileImageUpload')
  fileInput: ElementRef;

  @ViewChild('role')
  roleSelector: ElementRef;

  @ViewChild('pf') passwordForm: NgForm;

  constructor( private store: Store<fromRoot.State>,
    private userInfo$: Observable<UserInfo>,
    private userId: number,
    private http: Http) {
      this.isLoggedInAsAdmin$ = store.select(fromRoot.isAdmin);
      this.isLoggedInAsUserAdmin$ = store.select(fromRoot.isUserAdmin)
      this.success$ = store.select(fromRoot.getUserUpdateSuccess);
      this.submitted$ = store.select(fromRoot.getUserUpdateSubmitted);
      this.pendingUpdate$ = store.select(fromRoot.getUserUpdatePending);
      this.errors$ = store.select(fromRoot.getUserUpdateErrors)
      .map(codes => codes.map(this.mapErrorCodeToMessage));
      this.isUnlockPendingUpdate$ = store.select(fromRoot.getUnlockPendingUpdate);

      this.passwordSuccess$ = store.select(fromRoot.getPasswordUpdateSuccess);
      this.passwordSubmitted$ = store.select(fromRoot.getPasswordUpdateSubmitted);
      this.passwordPendingUpdate$ = store.select(fromRoot.getPasswordUpdatePending);
      this.passwordErrors$ = store.select(fromRoot.getPasswordUpdateErrors)
      .map(codes => codes.map(this.mapErrorCodeToMessage));

      this.profileImage$ = userInfo$.map(getDisplayProfileImage);

      this.notSocialUser$ = userInfo$.map(ui => !ui.socialUser);

      this.canUnlockUser$ = combineLatest(userInfo$.map(ui => ui.accountLocked),
      this.isLoggedInAsUserAdmin$).map(x => x[0] && x[1]);


      const currentFormData$ =  combineLatest(userInfo$, this.isLoggedInAsAdmin$)
        .map( uiWithIsAdmin => {
        const ui: UserInfo = uiWithIsAdmin[0];
        const isAdmin = uiWithIsAdmin[1];
        return {
        firstName: ui.firstName,
        lastName: ui.lastName,
        role: isAdmin ? highestLevelRole(ui) : null
        };
      });

      this.formDataSub = currentFormData$.subscribe(fd => {
        this.model.firstName = fd.firstName;
        this.model.lastName = fd.lastName;
        this.model.role = fd.role;
      });

      this.passwordSuccessSub = this.passwordSuccess$.subscribe( success => {
        if (success) {
          this.passwordModel.password = null;
        }
      });
  }

  // TODO some indication when save succeeds
  save(value: any) {
      const form: UserUpdateForm = {
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        role: this.model.role
      };

      this.store.dispatch(updateUser({
        userId: this.userId,
        userUpdateForm: form
      }));
  }

  updatePassword() {
    this.store.dispatch(updatePassword(this.userId, this.passwordModel.password));
    this.passwordForm.resetForm();
  }

  private mapErrorCodeToMessage(errorCode: string): string {
    switch (errorCode) {
      case 'SAME_PASSWORD':
      return 'The password has not changed';
      default:
      return 'There was an error with user update';
    }
  }

  private deleteUser() {
    if ( confirm('Are you sure you want to delete this user?')) {
      this.store.dispatch(fromUserUpdate.deleteUserRequest(this.userId));
    }
  }

  private viewTimeZones() {
    this.store.dispatch(fromRouter.go(`/home/users/${this.userId}/time-zones`))
  }

  manageUsers() {
    this.store.dispatch(fromRouter.go('/home/admin/users'));
  }

  unlockUser() {
    this.store.dispatch(fromUserUpdate.unlockUserRequest(this.userId));
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        const headers = SessionService.getSessionHeader()
        const options = new RequestOptions({ headers });
        this.http.post(`api/users/${this.userId}/image/upload`, formData, options)
            .catch(error => {
              this.store.dispatch(fromUserUpdate.updateProfileImageFailure(this.userId));
              return Observable.throw(error);
            })
            .subscribe( res => {
                this.store.dispatch(fromUserUpdate.updateProfileImageSuccess(this.userId, res.json().url ));
                this.fileInput.nativeElement.value = null;
            });
    }
}

  ngOnDestroy() {
    this.formDataSub.unsubscribe();
    this.passwordSuccessSub.unsubscribe();
  }
}
