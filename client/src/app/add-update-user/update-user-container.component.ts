import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild , Input, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

//TODO remove these
import { Http, RequestOptions } from '@angular/http';
import { SessionService } from 'app/core/services';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';

import * as fromRoot from 'app/core/store';
import { UserInfo } from 'app/core/models/session';
import { UserUpdateForm } from 'app/core/models/user-update';
import { updateUser, updatePassword } from 'app/core/store/actions/user-update.actions';


export abstract class UpdateUserComponent implements OnDestroy{
  modalTitle = 'Update';
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

  @ViewChild('profileImageUpload')
  fileInput: ElementRef;

  constructor( private store: Store<fromRoot.State>,
    private currentFormData$: Observable<UserUpdateForm>,
    private userId: number,
    private notSocialUser$: Observable<boolean>,
    private http: Http) {
      this.success$ = store.select(fromRoot.getUserUpdateSuccess);
      this.submitted$ = store.select(fromRoot.getUserUpdateSubmitted);
      this.pendingUpdate$ = store.select(fromRoot.getUserUpdatePending);
      this.errors$ = store.select(fromRoot.getUserUpdateErrors)
      .map(codes => codes.map(this.mapErrorCodeToMessage));

      this.passwordSuccess$ = store.select(fromRoot.getPasswordUpdateSuccess);
      this.passwordSubmitted$ = store.select(fromRoot.getPasswordUpdateSubmitted);
      this.passwordPendingUpdate$ = store.select(fromRoot.getPasswordUpdatePending);
      this.passwordErrors$ = store.select(fromRoot.getPasswordUpdateErrors)
      .map(codes => codes.map(this.mapErrorCodeToMessage));

      this.formDataSub = currentFormData$.subscribe(fd => {
        this.model.firstName = fd.firstName;
        this.model.lastName = fd.lastName;
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
        lastName: this.model.lastName
      };
      this.store.dispatch(updateUser({
        userId: this.userId,
        userUpdateForm: form
      }));
  }

  updatePassword() {
    this.store.dispatch(updatePassword(this.userId, this.passwordModel.password));
  }

  private mapErrorCodeToMessage(errorCode: string): string {
    switch (errorCode) {
      case 'SAME_PASSWORD':
      return 'The password has not changed';
      default:
      return 'There was an error with user update';
    }
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('file', file, file.name);
        let headers = SessionService.getSessionHeader()
        /** No need to include Content-Type in Angular 4 */
        // headers.append('Content-Type', 'multipart/form-data');
        // headers.append('Accept', 'application/json');
        const options = new RequestOptions({ headers });
        this.http.post(`api/users/${this.userId}/image/upload`, formData, options)
            .catch(error => Observable.throw(error))
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
