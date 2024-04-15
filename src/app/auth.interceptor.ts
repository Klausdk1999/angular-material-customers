import {
  HttpRequest,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  if (window.location.href.includes('login')) {
    return next(req);
  }

  if (window.location.href.includes('logout')) {
    localStorage.removeItem('access_token');
    return next(req);
  }

  if (typeof localStorage === 'undefined' || !localStorage) {
    return next(req);
  }

  const authToken = localStorage.getItem('access_token');

  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    return next(authReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return next(req);
      })
    );
  } else {
    window.location.href = '/login';
    return next(req);
  }
};
