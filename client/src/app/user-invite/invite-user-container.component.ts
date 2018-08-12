import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromRoot from 'app/core/store';
import * as fromUserInviteActions from 'app/core/store/actions/user-invite.actions';

@Component({
  templateUrl: './invite-user-container.component.html'
})
export class InviteUserComponent {
  success$: Observable<boolean>;
  submitted$: Observable<boolean>;
  pendingUpdate$: Observable<boolean>;
  errors$: Observable<Array<string>>;

  model: any = {};

  constructor(private store: Store<fromRoot.State>) {
    this.success$ = store.select(fromRoot.getUserInviteSuccess);
    this.submitted$ = store.select(fromRoot.getUserInviteSubmitted);
    this.pendingUpdate$ = store.select(fromRoot.getUserInvitePending);
    this.errors$ = store.select(fromRoot.getUserInviteErrors).map(codes => codes.map(this.mapErrorCodeToMessage));
  }

  save(value: any) {
    const email = this.model.email;
    this.store.dispatch(fromUserInviteActions.inviteUser(email));
  }

  reset() {
    this.model.email = null;
    this.store.dispatch(fromUserInviteActions.userInviteReset());
  }

  private mapErrorCodeToMessage(errorCode: string): string {
    switch (errorCode) {
      case 'EMAIL_IN_USE':
        return 'A user exists with that email address';
      default:
        return 'There was an error inviting this user';
    }
  }
}
