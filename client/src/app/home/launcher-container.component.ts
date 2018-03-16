import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromevent';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { SessionService } from 'app/core/services';
import { UserInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';
import { login } from 'app/core/store/actions/session.actions';

@Component({
    selector: 'app-launcher',
    templateUrl: './launcher-container.component.html'
})
export class LauncherContainerComponent {
    model: any = {};
    @ViewChild('username') username: ElementRef;
    @ViewChild('password') password: ElementRef;

    userInfo$: Observable<UserInfo>;
    enableButton$: Observable<boolean>;

    constructor(private router: Router, private sessionService: SessionService,
        private store: Store<fromRoot.State>) {
        this.userInfo$ = store.select(fromRoot.getUserInfo);
        this.enableButton$ = store.select(fromRoot.getPendingSessionUpdate).map(b => !b);
        this.userInfo$.subscribe(userInfo => {
             if (!!userInfo) {
               this.router.navigate(['home']);
             }
        });
    }

    login(myForm: NgForm) {
        this.store.dispatch(login(this.model.username, this.model.password));
    }
}
