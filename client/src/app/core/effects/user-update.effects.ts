import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/observable/concat';
import { Store } from '@ngrx/store';
import { back, go } from '@ngrx/router-store';

import { SessionService } from 'app/core/services';
import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';
import * as fromSession from 'app/core/store/actions/session.actions';
import * as fromToastActions from 'app/core/store/actions/toast.actions';
import { UserInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';

@Injectable()
export class UserUpdateEffects {
  constructor(
    private store: Store<fromRoot.State>,
    private http: Http,
    private actions$: Actions
  ) { }

  @Effect() createUser$ = this.actions$
    .ofType(fromUserUpdate.CREATE_USER_REQUEST)
    .switchMap(action => {
      return this.http.post('/api/users', action.payload)
      .map(res => {
        return fromUserUpdate.userCreateSuccess();
      })
      .catch(e => {
        if (!!e.json()) {
          return Observable.of(fromUserUpdate.userCreateFailure(e.json().errors));
        } else {
          return Observable.of(fromUserUpdate.userCreateFailure(['unknown']));
        }
      });
  });

  @Effect() createUserFromInvite$ = this.actions$
    .ofType(fromUserUpdate.USER_INVITE_CREATE_REQUEST)
    .switchMap(action => {
      return this.http.post('/api/users', action.payload)
      .switchMap(res => {
        SessionService.saveSessionId(res.headers.get('x-auth-token'));
        return Observable.of(fromUserUpdate.userCreateSuccess(), fromSession.loginStatusChange(res.json())) ;
      })
      .catch(e => {
        if (!!e.json()) {
          return Observable.of(fromUserUpdate.userCreateFailure(e.json().errors));
        } else {
          return Observable.of(fromUserUpdate.userCreateFailure(['unknown']));
        }
      });
  });

  @Effect() updateUser$ = this.actions$
  .ofType(fromUserUpdate.UPDATE_USER_REQUEST)
  .switchMap(action => {
    const userId = action.payload.userId;
    return this.http.put(`/api/users/${userId}`, action.payload.userUpdateForm, 
    { headers: SessionService.getSessionHeader()} )
    .map(res => {
        if (res.ok) {
            return fromUserUpdate.userUpdateSuccess(res.json());
        } else {
          return fromUserUpdate.userUpdateFailure(res.json().errors, userId);
        }
    })
    .catch(e => Observable.of(fromUserUpdate.userUpdateFailure(['unknown'], userId)));
  });

  @Effect() updatePassword$ = this.actions$
  .ofType(fromUserUpdate.UPDATE_PASSWORD_REQUEST)
  .switchMap(action => {
    const userId = action.payload.userId;
    return this.http.put(`/api/users/${userId}/password`, { password: action.payload.password },
    { headers: SessionService.getSessionHeader()} )
    .map(res => {
        if (res.json().success) {
            return fromUserUpdate.updatePasswordSuccess();
        } else {
          return fromUserUpdate.updatePasswordFailure(res.json().errors);
        }
    })
    .catch(e => Observable.of(fromUserUpdate.updatePasswordFailure(['unknown'])));
  });

  @Effect() deleteUser$ = this.actions$
  .ofType(fromUserUpdate.DELETE_USER_REQUEST)
  .switchMap(action => {
    const userId = action.payload;
    return this.http.delete(`/api/users/${userId}`,
    { headers: SessionService.getSessionHeader()} )
    .map(res => {
        if (res.ok) {
          return fromUserUpdate.deleteUserSuccess(userId);
        } else {
          return fromUserUpdate.deleteUserFailure(userId);
        }
    })
    .catch(e => Observable.of(fromUserUpdate.deleteUserFailure(userId)));
  });

  @Effect() unlockUser$ = this.actions$
  .ofType(fromUserUpdate.UNLOCK_USER_REQUEST)
  .switchMap(action => {
    const userId = action.payload;
    return this.http.get(`/api/admin/user-unlock?id=${userId}`,
    { headers: SessionService.getSessionHeader()} )
    .map(res => {
        if (res.ok) {
          return fromUserUpdate.unlockUserSuccess(userId);
        } else {
          return fromUserUpdate.unlockUserFailure(userId);
        }
    })
    .catch(e => Observable.of(fromUserUpdate.unlockUserFailure(userId)));
  });

  @Effect() leaveDeletedUser$ = this.actions$
  .ofType(fromUserUpdate.DELETE_USER_SUCCESS)
  .map( action => fromUserUpdate.userUpdateReset());

  @Effect() userUpdateError$ = this.actions$
  .ofType(fromUserUpdate.USER_UPDATE_FAILURE)
  .map(action => fromToastActions.faillToast(`Error Updating User`, 'Error'));

  @Effect() userUpdateSuccess$ = this.actions$
  .ofType(fromUserUpdate.USER_UPDATE_SUCCESS)
  .map(action => fromToastActions.successToast(`User was updated successfully`,
   'Success!'));

   @Effect() passwordUpdateError$ = this.actions$
   .ofType(fromUserUpdate.UPDATE_PASSWORD_FAILURE)
   .map(action => fromToastActions.faillToast(`Error Updating User Password`, 'Error'));
 
   @Effect() passwordUpdateSuccess$ = this.actions$
   .ofType(fromUserUpdate.UPDATE_PASSWORD_SUCCESS)
   .map(action => fromToastActions.successToast(`User Password Was Updated Successfully`,
    'Success!'));

    @Effect() profileImageUpdateError$ = this.actions$
    .ofType(fromUserUpdate.PROFILE_IMAGE_UPDATE_FAILURE)
    .map(action => fromToastActions.faillToast(`Error Updating Profile Image`, 'Error'));
  
    @Effect() profileImageUpdateSuccess$ = this.actions$
    .ofType(fromUserUpdate.PROFILE_IMAGE_UPDATE_SUCCESS)
    .map(action => fromToastActions.successToast(`Profile Imsage Was Updated Successfully`,
     'Success!'));

     @Effect() unlockUpdateError$ = this.actions$
     .ofType(fromUserUpdate.UNLOCK_USER_FAILURE)
     .map(action => fromToastActions.faillToast(`Error Unlocking User`, 'Error'));
   
     @Effect() unlockUpdateSuccess$ = this.actions$
     .ofType(fromUserUpdate.UNLOCK_USER_SUCCESS)
     .map(action => fromToastActions.successToast(`User was Unlocked Successfully`,
      'Success!'));

      @Effect()deleteUserErrors$ = this.actions$
      .ofType(fromUserUpdate.DELETE_USER_FAILURE)
      .map(action => fromToastActions.faillToast(`Error Deleting User`, 'Error'));
    
      @Effect() deleteUserSuccess$ = this.actions$
      .ofType(fromUserUpdate.DELETE_USER_SUCCESS)
      .map(action => fromToastActions.successToast(`User was Deleted Successfully`,
       'Success!'));
}
