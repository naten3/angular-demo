import { Component, Input, OnInit, ChangeDetectionStrategy, 
    OnChanges, AfterViewInit, ElementRef,
     ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TreeEvents } from 'app/tree/tree-events';
import { SourceType } from 'app/core/models/tree';
import { Subscription } from 'rxjs/Subscription';

import { UserInfo, getDisplayProfileImage } from 'app/core/models/session';

@Component({
    selector: 'app-user-item',
    template: `
    <div class="card" style="width: 18rem;">
    <img class="card-img-top" [src]="getDisplayImage()" alt="profile image">
    <div class="card-body">
      <h5 class="card-title">{{user.firstName}} {{user.lastName}}</h5>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Cras justo odio</li>
      <li class="list-group-item">Dapibus ac facilisis in</li>
      <li class="list-group-item">Vestibulum at eros</li>
    </ul>
  </div>
  `, styles: [`
        ul {list-style-type: none;}
        .selected {background-color: yellow}
        .focused { outline: 1px dashed red; }
        :focus {outline:none}
        .card-img-top { height: 18rem; width: 100%; }
        `]
})

export class UserItemComponent {
    @Input() user: UserInfo;

    getDisplayImage(): string {
        return getDisplayProfileImage(this.user);
    }
}

