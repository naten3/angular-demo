import { Component, Input, OnInit, ChangeDetectionStrategy, 
    OnChanges, AfterViewInit, ElementRef,
     ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TreeEvents } from 'app/tree/tree-events';
import { SourceType } from 'app/core/models/tree';
import { Subscription } from 'rxjs/Subscription';

import { UserInfo } from 'app/core/models/session';

@Component({
    selector: 'app-user-item',
    template: `
    <div #userItem>
       This user is {{user.id}}
     </div>
  `, styles: [`
        .selected {background-color: yellow}
        .focused { outline: 1px dashed red; }
        :focus {outline:none}
        `]
})

export class UserItemComponent {
    @Input() user: UserInfo;
}

