import { Component, Input, OnInit, ChangeDetectionStrategy, 
    OnChanges, AfterViewInit, ElementRef,
     ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TreeEvents } from 'app/tree/tree-events';
import { SourceType } from 'app/core/models/tree';
import { Subscription } from 'rxjs/Subscription';

import { TimeZone } from 'app/core/models/time-zone';

@Component({
    selector: 'app-time-zone-item',
    template: `
    <div class="card" style="width: 12rem;">
    <img class="card-img-top" [src]="getDisplayImage()" alt="profile image">
    <div class="card-body">
      <h6 class="card-title m-0">{{user.firstName}} {{user.lastName}}</h6>
    </div>
    <ul class="list-group list-group-flush">
      
      <li class="list-group-item">
        <dl>
          <dt>Email</dt>
          <dd>{{user.email}}</dd>
        </dl>
      </li>
      <li class="list-group-item">
        <dl>
          <dt>Username</dt>
          <dd>{{user.username}}</dd>
        </dl>
      </li>
      <li class="list-group-item">
        <dl>
          <dt>Role</dt>
          <dd>{{getRole()}}</dd>
        </dl>
      </li>
      <li class="list-group-item">
        <dl>
          <dt>Email Verified</dt>
          <dd>{{emailVerifiedString()}}</dd>
        </dl>
      </li>
    </ul>
  </div>
  `, styles: [`
        ul {list-style-type: none;}
        dl {margin: 0}
        dt {font-size: 8pt}
        dd {font-size: 8pt}
        .card-body {padding: 4px;}
        .list-group-item {padding: 3px 5px}
        .card-img-top {object-fit: cover;}
        .selected {background-color: yellow}
        .focused { outline: 1px dashed red; }
        :focus {outline:none}
        .card-img-top { height: 12rem; width: 100%; }
        `]
})

export class UserItemComponent {
    // @Input() user: UserInfo;

}

