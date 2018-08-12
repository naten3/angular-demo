import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import * as fromRoot from 'app/core/store';
import { UserSaveRequest } from 'app/core/models/user-save';
import { createUser, userInviteCreate } from 'app/core/store/actions/user-update.actions';

@Component({
  templateUrl: './add-user.component.html'
})
export class AddUserComponent implements OnDestroy {
  success$: Observable<boolean>;
  submitted$: Observable<boolean>;
  pendingUpdate$: Observable<boolean>;
  errors$: Observable<Array<string>>;
  isAdmin$: Observable<boolean>;

  authenticatedSuccess$: Observable<boolean>;
  nonAuthenticatedSuccess$: Observable<boolean>;

  model: any = {};
  inviteInformation$: Observable<InviteInformation>;
  inviteValid$: Observable<boolean>;
  emailSub: Subscription;
  validInviteSub: Subscription;
  tokenSub: Subscription;

  validInvite = false;
  inviteToken: string;

  constructor(private store: Store<fromRoot.State>, private route: ActivatedRoute) {
    this.success$ = store.select(fromRoot.getUserSaveSuccess);
    this.submitted$ = store.select(fromRoot.getUserSaveSubmitted);
    this.pendingUpdate$ = store.select(fromRoot.getUserSavePending);
    this.errors$ = store.select(fromRoot.getUserSaveErrors).map(codes => codes.map(this.mapErrorCodeToMessage));

    const authenticated$ = store.select(fromRoot.getUserInfo).map(ui => !!ui);
    this.authenticatedSuccess$ = combineLatest(this.success$, authenticated$).map(x => x[0] && x[1]);

    this.nonAuthenticatedSuccess$ = combineLatest(this.success$, authenticated$).map(x => x[0] && !x[1]);

    const email$ = this.route.data.map(x => x['email']);
    const token$ = this.route.queryParams.map(p => p['invite-token']);

    // TODO clean up
    this.inviteInformation$ = combineLatest(email$, token$).map(x => {
      return {
        email: x[0],
        token: x[1]
      };
    });

    this.inviteValid$ = this.inviteInformation$.map(x => !!x.email && !!x.token);

    this.emailSub = email$.subscribe(x => (this.model.email = x));
    this.tokenSub = token$.subscribe(x => (this.inviteToken = x));
    this.validInviteSub = this.inviteValid$.subscribe(x => (this.validInvite = x));
  }

  save(value: any) {
    const userSaveRequest = new UserSaveRequest();
    userSaveRequest.email = this.model.email;
    userSaveRequest.username = this.model.username;
    userSaveRequest.password = this.model.password;
    userSaveRequest.firstName = this.model.firstName;
    userSaveRequest.lastName = this.model.lastName;

    if (!this.validInvite) {
      userSaveRequest.inviteToken = null;
      this.store.dispatch(createUser(userSaveRequest));
    } else {
      userSaveRequest.inviteToken = this.inviteToken;
      this.store.dispatch(userInviteCreate(userSaveRequest));
    }
  }

  goToLogin() {
    this.store.dispatch(fromRouter.go('/'));
  }

  goToHome() {
    this.store.dispatch(fromRouter.go('home'));
  }

  private mapErrorCodeToMessage(errorCode: string): string {
    switch (errorCode) {
      case 'USERNAME_IN_USE':
        return 'The username is already in use';
      case 'EMAIL_IN_USE':
        return 'The email address is already in use';
      case 'ILLEGAL_USERNAME':
        return 'The username is illegal';
      default:
        return 'There was an error with registration';
    }
  }

  ngOnDestroy() {
    this.emailSub.unsubscribe();
    this.validInviteSub.unsubscribe();
    this.tokenSub.unsubscribe();
  }
}

interface InviteInformation {
  email: string;
  token: string;
}
