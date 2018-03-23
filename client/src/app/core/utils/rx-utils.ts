import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

export function filterNotNull<T>(arg: Observable<T>): Observable<T> {
  return arg.pipe(filter(x => !!x));
}
