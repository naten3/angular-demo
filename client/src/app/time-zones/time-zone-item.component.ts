import { Component, Input, OnInit, ChangeDetectionStrategy, 
    OnChanges, AfterViewInit, ElementRef,
     ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { TreeEvents } from 'app/tree/tree-events';
import { SourceType } from 'app/core/models/tree';
import { Subscription } from 'rxjs/Subscription';
import { padStart } from 'lodash';
import * as moment from 'moment';

import { TimeZone } from 'app/core/models/time-zone';

@Component({
    selector: '[app-time-zone-item]',
    template: `
    <td>{{timeZone.timeZoneName}}</td>
    <td>{{timeZone.cityName}}</td>
    <td>{{getGmtOffest()}}</td>
    <td>{{timeInZone$ | async}}</td>
  `, styles: [`
        `]
})

export class TimeZoneItemComponent {
    @Input() timeZone: TimeZone;

    timeInZone$: Observable<string>;

    constructor() {
      const timeTimer$ = timer(0, 60000);
      // TODO update with change in zone
      this.timeInZone$ = timeTimer$
        .map( unused => {
        const currentTime = moment.utc();

        const offset = { hours: this.timeZone.offsetHours, minutes: this.timeZone.offsetMinutes};
        const timeWithOffset = this.timeZone.positiveOffset ?
        currentTime.add(offset)
        : currentTime.subtract(offset);
        return timeWithOffset.format('hh:mm A');
      });
    }

    getGmtOffest(): string {
      return this.timeZone.positiveOffset ? '+' : '-'
      + this.timeZone.offsetHours + ':' + padStart(this.timeZone.offsetMinutes, 2, '0');
    }
}

