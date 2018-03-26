import { Component, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { SessionService } from 'app/core/services';
import * as fromRoot from 'app/core/store';
import { State } from 'app/core/models/app.state';
import { UserInfo } from 'app/core/models/session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  userInfo$: Observable<UserInfo>;

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRoot.State>,
  private toastr: ToastsManager,
  private vcr: ViewContainerRef) {
      this.sessionService.getSessionStatus();
      this.toastr.setRootViewContainerRef(vcr);
  }
}

