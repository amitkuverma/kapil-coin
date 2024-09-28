import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './services/cookie.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookies:CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add the Authorization header with the token
    const token = this.cookies.getCookie('token'); // Or retrieve your token in the desired way
    
    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
