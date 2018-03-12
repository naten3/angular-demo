import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromevent';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { SessionService } from 'app/core/services';
import { SessionInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';
import { requestSessionStatus } from 'app/core/store/actions/session.actions';

@Component({
    selector: 'app-launcher',
    template: `
        <div class="container">
            <div class="form-group">
                <input id="nameEntryForm" #input placeholder="Welcome to Mahjong Enter Your Name" 
                ng-disabled="!enableButton" class="form-control" />
                <div class ="group-control">
                    <button #btnLaunch class="btn btn-success btn-lg" (click)="clicked()">Go</button>
                </div>
            </div>
        </div>
    `
})
export class LauncherComponent implements AfterViewInit {
    @ViewChild('input') input: ElementRef;
    @ViewChild('btnLaunch') launch: ElementRef;

    sessionInfo$: Observable<SessionInfo>;
    enableButton$: Observable<boolean>;

    constructor(private router: Router, private sessionService: SessionService,
        private store: Store<fromRoot.State>) {
        this.sessionInfo$ = store.select(fromRoot.getSessionInfo);
        this.enableButton$ = store.select(fromRoot.getPendingSessionUpdate).map(b => !b);
        this.sessionInfo$.subscribe(sessionInfo => {
            if (!!sessionInfo) {
              this.router.navigate(['home']);
            }
        });
    }

    ngAfterViewInit() {

    }

    clicked() {
        this.store.dispatch(requestSessionStatus());
        this.sessionService.initSession(this.input.nativeElement.value);
    }
}
