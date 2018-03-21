import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { replace } from '@ngrx/router-store';

import * as fromRoot from 'app/core/store';

@Injectable()
export class UserInviteResolver implements Resolve<string> {

    constructor(
        private store: Store<fromRoot.State>,
        private http: Http
      ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
        const token = route.queryParamMap.get('invite-token');

        if (!token) {
            return Observable.of(null);
        } else {
            const params: URLSearchParams = new URLSearchParams();
            params.append('invite-token', token);
            return this.http.get('/api/users/signup-invite', {params})
            .map(res => {
                return res.json().email;
            }).catch( (er) => {
                console.error('Invalid login token');
                this.store.dispatch(replace('user-create/invalid-token'));
                return Observable.of(null);
            });
        }

    }
}
