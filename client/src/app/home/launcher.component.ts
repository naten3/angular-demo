import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
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
    template: `
        <div class="container">
            <div class="form-group">
                <input #username placeholder="Username" class="form-control" />
                <input #password placeholder="Password" class="form-control" />
                <div class ="group-control">
                    <button ng-disabled="enableButton$" #btnLaunch class="btn btn-success btn-lg" (click)="clicked()">Go</button>
                </div>
            </div>
        </div>
    `
})
export class LauncherComponent implements AfterViewInit {
    @ViewChild('username') username: ElementRef;
    @ViewChild('password') password: ElementRef;
    @ViewChild('btnLaunch') launch: ElementRef;

    userInfo$: Observable<UserInfo>;
    enableButton$: Observable<boolean>;

    constructor(private router: Router, private sessionService: SessionService,
        private store: Store<fromRoot.State>) {
        this.userInfo$ = store.select(fromRoot.getUserInfo);
        this.enableButton$ = store.select(fromRoot.getPendingSessionUpdate).map(b => !b);
        // this.userInfo$.subscribe(userInfo => {
        //     if (!!userInfo) {
        //       this.router.navigate(['home']);
        //     }
        // });
    }

    ngAfterViewInit() {

    }

    clicked() {
        // TODO validate
        this.store.dispatch(login(this.username.nativeElement.value, this.password.nativeElement.value));
    }
}
