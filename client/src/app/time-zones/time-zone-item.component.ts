import { Component, Input, OnInit, ChangeDetectionStrategy, 
    OnChanges, AfterViewInit, ElementRef,
     ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TreeEvents } from 'app/tree/tree-events';
import { SourceType } from 'app/core/models/tree';
import { Subscription } from 'rxjs/Subscription';
import { padStart } from 'lodash';

import { TimeZone } from 'app/core/models/time-zone';

@Component({
    selector: '[app-time-zone-item]',
    template: `
    <td>{{timeZone.timeZoneName}}</td>
    <td>{{timeZone.cityName}}</td>
    <td>{{getGmtOffest()}}</td>
    <td>{{timeinZone$ | async}}</td>
  `, styles: [`
        `]
})

export class TimeZoneItemComponent {
    @Input() timeZone: TimeZone;

    timeinZone$: Observable<string> = Observable.of('placeholder1');

    getGmtOffest(): string {
      return this.timeZone.positiveOffset ? '+' : '-'
      + this.timeZone.offsetHours + ':' + padStart(this.timeZone.offsetMinutes, 2, '0');
    }
}

