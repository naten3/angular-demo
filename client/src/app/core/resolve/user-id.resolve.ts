import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { take, filter } from 'rxjs/operators';

import { UserInfo } from 'app/core/models/session';
import * as fromRoot from 'app/core/store';

@Injectable()
export class IdResolver implements Resolve<number> {
  constructor(private store: Store<fromRoot.State>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> {
    return this.store
      .select(fromRoot.getUserInfo)
      .map(x => x.id)
      .pipe(take(1));
  }
}
