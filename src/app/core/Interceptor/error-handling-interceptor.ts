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
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(retry(1),catchError((error: HttpErrorResponse) => {

          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.error.MessageList}`;
          } else {
            // server-side error
            console.log('error',error.error)
            errorMessage = `We Are Unable To Process Your Request Please Try Again Later \nView Error Details Below: \nError Code: ${error.error.statusCode} \nMessage: ${error.error.message}`;
          }
          // window.alert(errorMessage);

          this.toastr.error(errorMessage)
          if (error.error.statusCode === 401 && error.error.message =="token is not valid") {
           
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
