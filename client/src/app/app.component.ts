import { Component, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'app/core/services';
import * as fromRoot from 'app/core/store';
import { State } from 'app/core/models/app.state';
import { SessionInfo } from 'app/core/models/session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit{

  sessionInfo$: Observable<SessionInfo>;

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRoot.State>) {

    this.sessionInfo$ = store.select(fromRoot.getSessionInfo);
  }

  ngAfterViewInit() {

    if (!this.sessionService.getSessionId()) {
      this.router.navigate(['/']);
    } else {
      this.sessionService.getSessionStatus();
    }
    console.log('After view init ran');
    this.sessionInfo$.subscribe(sessionInfo => {
      if (!sessionInfo) {
        this.router.navigate(['/']);
      }
    });
  }
}

