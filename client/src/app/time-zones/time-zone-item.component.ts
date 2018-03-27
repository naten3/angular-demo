import { Component, Input, Output, OnInit, ChangeDetectionStrategy,
    OnChanges, AfterViewInit, ElementRef,
     ViewChild, OnDestroy, EventEmitter } from '@angular/core';
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
    <td>
      <button (click)="edit()" class="btn btn-primary">Edit</button>
    </td>
    <td>
    <button (click)="delete()" class="btn btn-primary">Delete</button>
    </td>
  `, styles: [`
        app-add-update-time-zone {
          width: 50%;
        }
        `]
})

export class TimeZoneItemComponent implements OnInit{
    @Input() timeZone: TimeZone;
    @Output() updateTimeZoneEmitter = new EventEmitter<TimeZone>();
    @Output() deleteEmitter = new EventEmitter<number>();

    timeInZone$: Observable<string>;

    constructor() {}

    getGmtOffest(): string {
      return (this.timeZone.positiveOffset ? '+' : '-')
      + this.timeZone.offsetHours + ':' + padStart(this.timeZone.offsetMinutes, 2, '0');
    }

    ngOnInit() {
      const timeTimer$ = timer(0, 10000);
      this.timeInZone$ = timeTimer$
        .map( unused => {
        const currentTime = moment.utc();
        const offset = { hours: this.timeZone.offsetHours, minutes: this.timeZone.offsetMinutes};
        const timeWithOffset = this.timeZone.positiveOffset ?
        currentTime.add(offset)
        : currentTime.subtract(offset);
        return timeWithOffset.format('hh:mm A DD-MMM-YY');
      });
    }

    edit() {
      this.updateTimeZoneEmitter.emit(this.timeZone);
    }

    delete() {
      this.deleteEmitter.emit(this.timeZone.id);
    }
}

