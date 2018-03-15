import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromevent';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';

import { SessionService } from 'app/core/services';
import { UserInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';
import { login } from 'app/core/store/actions/session.actions';

@Component({
    selector: 'app-launcher',
    templateUrl: './launcher.component.html'
})
export class LauncherComponent implements AfterViewInit {
    model: any = {};
    @ViewChild('username') username: ElementRef;
    @ViewChild('password') password: ElementRef;

    userInfo$: Observable<UserInfo>;
    enableButton$: Observable<boolean>;

    constructor(private router: Router, private sessionService: SessionService,
        private store: Store<fromRoot.State>, private fb: FacebookService) {
        this.userInfo$ = store.select(fromRoot.getUserInfo);
        this.enableButton$ = store.select(fromRoot.getPendingSessionUpdate).map(b => !b);
        this.userInfo$.subscribe(userInfo => {
             if (!!userInfo) {
               this.router.navigate(['home']);
             }
        });

        const initParams: InitParams = {
            appId: '159762671398094',
            xfbml: true,
            version: 'v2.8'
          };

          fb.init(initParams);
    }

    ngAfterViewInit() {

    }

    login(myForm: NgForm) {
        this.store.dispatch(login(this.model.username, this.model.password));
    }

    loginWithFacebook(): void {
        this.fb.login()
          .then((response: LoginResponse) => console.log(response))
          .catch((error: any) => console.error(error));
    }
}
