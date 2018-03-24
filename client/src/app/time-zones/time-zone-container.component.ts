import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import 'rxjs/add/observable/fromevent';
import { Router, ActivatedRoute } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/core/store';

import { AddUpdateTimeZoneComponent } from './';
import { UserInfo } from 'app/core/models/session';
import { TimeZone } from 'app/core/models/time-zone';
import { filterNotNull } from 'app/core/utils/rx-utils';
import * as fromTimeZoneActions from 'app/core/store/actions/time-zone.actions';

@Component({
    selector: 'app-time-zone',
    templateUrl: './time-zone-container.component.html',
    styles: [`
      .tz-update-wrapper {
        float: left;
        width: 50%;
      }
    `]
})
export class TimeZoneComponent {
  @ViewChild('createTimeZone') createTimeZoneComponent: AddUpdateTimeZoneComponent;
  @ViewChild('editTimeZone') editTimeZoneComponent: AddUpdateTimeZoneComponent;

  userId: number;

  ownerInfo$: Observable<UserInfo>;
  userTimeZones$: Observable<Array<TimeZone>>;
  currentlyEditing = false;

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute) {
      this.ownerInfo$ = filterNotNull(store.select(fromRoot.getTimeZoneUser));
      this.userTimeZones$ = filterNotNull(store.select(fromRoot.getTimeZones))
      .map(x => {
        console.log('time zones ' + x.map(y => y.id).join(','));
        return x;
      });

      this.userId = Number(route.snapshot.params['userId']);
    }

  getTimezoneId(timeZone: TimeZone) {
    return timeZone.id;
  }

  createNew(timeZone: TimeZone) {
    this.createTimeZoneComponent.resetForm();
    this.store.dispatch(fromTimeZoneActions.createTimeZone(timeZone, this.userId));
  }

  delete(id: number) {
    this.store.dispatch(fromTimeZoneActions.deleteTimeZone(id, this.userId));
  }

  edit(timeZone: TimeZone) {
    this.editTimeZoneComponent.resetForm(timeZone);
    this.currentlyEditing = true;
  }

  saveTimeZoneEdit(timeZone: TimeZone) {
    this.createTimeZoneComponent.resetForm();
    this.currentlyEditing = false;
    this.store.dispatch(fromTimeZoneActions.updateTimeZone(timeZone, this.userId));
  }
}
