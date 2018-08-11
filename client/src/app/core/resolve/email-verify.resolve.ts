import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EmailVerifyResolver implements Resolve<boolean> {
  constructor(private http: Http) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const userId = route.queryParamMap.get('userId');
    const token = route.queryParamMap.get('token');

    if (!userId || !token) {
      console.error('verify url must have userId and token params');
      return Observable.of(false);
    } else {
      const params: URLSearchParams = new URLSearchParams();
      params.append('userId', userId);
      params.append('token', token);
      return this.http.get('/api/users/verify-email', { params }).map(res => {
        return res.json().success;
      });
    }
  }
}
