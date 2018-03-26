import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { mergeMap } from 'rxjs/operators';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import * as fromUserUpdate from 'app/core/store/actions/user-update.actions';
import { SessionService } from 'app/core/services';
import * as fromtToastActions from 'app/core/store/actions/toast.actions';
import { UserInfo } from 'app/core/models/session';
import { Page } from 'app/core/models/common';
import * as fromRoot from 'app/core/store';

@Injectable()
export class ToastEffects {

  constructor(
    private toastr: ToastsManager,
    private actions$: Actions
  ) {}

  @Effect() successToast$ = this.actions$
  .ofType(fromtToastActions.SUCCESS_TOAST)
  .forEach(action => {
    this.toastr.success(action.payload.content, action.payload.title);
  });

  @Effect() failToast$ = this.actions$
  .ofType(fromtToastActions.FAIL_TOAST)
  .forEach(action => {
    this.toastr.error(action.payload.content, action.payload.title);
  });
}
