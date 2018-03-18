import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from 'app/core/store';
import { UserInfo } from 'app/core/models/session';

// This should fun after the auth guard so userInfo should be there already
@Injectable()
export class UserInfoResolver implements Resolve<UserInfo> {

    constructor(
        private store: Store<fromRoot.State>
      ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserInfo> {
        return this.store.select(fromRoot.getUserInfo);
    }
}
