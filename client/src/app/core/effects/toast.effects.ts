import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as fromtToastActions from 'app/core/store/actions/toast.actions';

@Injectable()
export class ToastEffects {
  constructor(private toastr: ToastsManager, private actions$: Actions) {}

  @Effect()
  successToast$ = this.actions$.ofType(fromtToastActions.SUCCESS_TOAST).forEach(action => {
    this.toastr.success(action.payload.content, action.payload.title);
  });

  @Effect()
  failToast$ = this.actions$.ofType(fromtToastActions.FAIL_TOAST).forEach(action => {
    this.toastr.error(action.payload.content, action.payload.title);
  });
}
