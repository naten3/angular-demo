import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromevent';
import { Router, ActivatedRoute } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/core/store';



@Component({
    selector: 'app-time-zone',
    templateUrl: './time-zone.component.html'
})
export class TimeZoneComponent {

  authenticated$: Observable<boolean>

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute) {
      this.authenticated$ = store.select(fromRoot.getAuthenticated);
    }

  goToLogin() {
    this.store.dispatch(go('/'));
  }

  goToHom() {
    this.store.dispatch(go('/home'));
  }
}
