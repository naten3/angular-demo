import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
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
        padding: 0 5px;
      }
    `]
})
export class TimeZoneComponent {
  @ViewChild('createTimeZone') createTimeZoneComponent: AddUpdateTimeZoneComponent;
  @ViewChild('editTimeZone') editTimeZoneComponent: AddUpdateTimeZoneComponent;

  userId: number;

  ownerInfo$: Observable<UserInfo>;
  userTimeZones$: Observable<Array<TimeZone>>;
  shouldShowOwnerInfo$: Observable<boolean>;
  filterText$: Subject<string> = new BehaviorSubject('');

  currentlyEditing = false;

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute) {
      this.ownerInfo$ = filterNotNull(store.select(fromRoot.getTimeZoneUser));
      this.userTimeZones$ = filterNotNull(store.select(fromRoot.getTimeZones))

      this.userId = Number(route.snapshot.params['userId']);

      this.shouldShowOwnerInfo$ = filterNotNull(store.select(fromRoot.getUserInfo)).map(ui =>
        ui.id !== this.userId);
    }

  getTimezoneId(timeZone: TimeZone) {
    return timeZone.id;
  }

  timeZoneList(): Observable<Array<TimeZone>> {
    return combineLatest(this.userTimeZones$, this.filterText$).map(timeZonesWithFilter => {
      const timeZones = timeZonesWithFilter[0];
      const filter = timeZonesWithFilter[1];
      if (!filter) {
        return timeZones;
      } else {
        return timeZones.filter(tz =>
          tz.timeZoneName.toUpperCase().includes(filter.toUpperCase()));
      }
    });
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

  ownerInfoText(): Observable<string> {
    return this.ownerInfo$.map(oi =>
    `Showing Time Zones for ${oi.firstName} ${oi.lastName} username: ${oi.username}`);
  }

  filterTimeZones(filter: string) {
    this.filterText$.next(filter);
  }
}
