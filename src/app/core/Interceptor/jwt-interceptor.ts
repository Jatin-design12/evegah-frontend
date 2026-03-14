//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 7 June 2021
//==============================================================================
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() { }

  private normalizeApiPath(url: string): string {
    // Prevent malformed URLs like /api/api/v1/... when base URL already includes /api/
    return url.replace('/api/api/', '/api/');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      url: this.normalizeApiPath(request.url)
    });

    // add auth header with jwt if user is logged in and request is to api url
    // const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = true
    // currentUser && currentUser.token;
    const token = ''
    if (isLoggedIn) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
