//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 7 June 2021
//@Desc: Http error handling intercept
//==============================================================================

import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SessionService } from 'src/app/core/services/session.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  subscription: Subscription[] = [];
    private spinner: NgxSpinnerService
    constructor(private toastr: ToastrService,
    public router: Router,  private sessionService: SessionService,
    ){}

  private getReadableErrorMessage(error: HttpErrorResponse): string {
    const payload: any = error?.error;
    const serverStatusCode = payload?.statusCode || error.status;
    const serverMessage = payload?.message || error.statusText || 'Unexpected server error';
    const payloadAsText = typeof payload === 'string' ? payload : '';
    const looksLikeHtmlError = payloadAsText.includes('<html') || payloadAsText.includes('<!DOCTYPE html');

    if (error.status === 502 || looksLikeHtmlError) {
      return 'Server is temporarily unavailable (502 Bad Gateway). Please try again in a moment.';
    }

    if (error.status === 0) {
      return 'Unable to reach server. Please check network connection and server availability.';
    }

    return `We Are Unable To Process Your Request Please Try Again Later \nView Error Details Below: \nError Code: ${serverStatusCode} \nMessage: ${serverMessage}`;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(retry(1),catchError((error: HttpErrorResponse) => {

          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.error?.MessageList || error.error.message || 'Client-side error'}`;
          } else {
            // server-side error
            console.log('error',error.error)
            errorMessage = this.getReadableErrorMessage(error);
          }
          // window.alert(errorMessage);

          this.toastr.error(errorMessage)
          const statusCode = error?.error?.statusCode || error?.status;
          const statusMessage = error?.error?.message || '';
          if (statusCode === 401 && statusMessage =="token is not valid") {
           
            this.toastr.error(errorMessage)
            this.logOut();
          }
          return throwError(errorMessage);
    }))
  }

  logOut(){
        sessionStorage.clear();
        this.router.navigate(['/login']);
  
  }
}
