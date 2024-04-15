import {
  HttpRequest,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authToken = localStorage.getItem('access_token');
  console.log('authToken', authToken);
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    return next(authReq);
  }

  return next(req);
};
