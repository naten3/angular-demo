import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import 'rxjs/add/observable/fromevent';
import { Router, ActivatedRoute } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/core/store';

import { UserInfo } from 'app/core/models/session';
import { TimeZone } from 'app/core/models/time-zone';



@Component({
    selector: 'app-time-zone',
    templateUrl: './time-zone-container.component.html'
})
export class TimeZoneComponent {

  ownerInfo$: Observable<UserInfo>;
  userTimeZones$: Observable<Array<TimeZone>>;

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute) {
      this.ownerInfo$ = store.select(fromRoot.getTimeZoneUser);
      this.userTimeZones$ = store.select(fromRoot.getTimeZones);
    }

  goToLogin() {
    this.store.dispatch(go('/'));
  }

  goToHom() {
    this.store.dispatch(go('/home'));
  }
}
