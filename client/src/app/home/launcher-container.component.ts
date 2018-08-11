import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromevent';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { SessionService } from 'app/core/services';
import { UserInfo, INVALID_CREDENTIALS } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';
import { login } from 'app/core/store/actions/session.actions';

@Component({
  selector: 'app-launcher',
  templateUrl: './launcher-container.component.html'
})
export class LauncherContainerComponent {
  model: any = {};
  @ViewChild('username')
  username: ElementRef;
  @ViewChild('password')
  password: ElementRef;
  @ViewChild('f')
  loginForm: NgForm;

  userInfo$: Observable<UserInfo>;
  enableButton$: Observable<boolean>;
  errors$: Observable<Array<string>>;

  constructor(private router: Router, private sessionService: SessionService, private store: Store<fromRoot.State>) {
    this.userInfo$ = store.select(fromRoot.getUserInfo);
    this.enableButton$ = store.select(fromRoot.getPendingSessionUpdate).map(b => !b);
    this.userInfo$.subscribe(userInfo => {
      if (!!userInfo) {
        this.store.dispatch(fromRouter.go('home'));
      }
    });

    this.errors$ = this.store.select(fromRoot.getUserLoginErrors).map(x => x.map(this.mapErrorCodeToMessage));
  }

  login(myForm: NgForm) {
    this.store.dispatch(login(this.model.username, this.model.password));
    this.loginForm.resetForm();
  }

  register() {
    this.store.dispatch(fromRouter.go('user-create'));
  }

  private mapErrorCodeToMessage(errorCode: string): string {
    switch (errorCode) {
      case INVALID_CREDENTIALS:
        return 'Invalid Login Credentials!';
      default:
        return 'There was an error with login';
    }
  }
}
