import { PipesModule } from './core/pipes/pipes.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { SharedModule } from './shared/shared.modules';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './core/Interceptor/error-handling-interceptor';
import { JwtInterceptor } from './core/Interceptor/jwt-interceptor';
import { LoadingInterceptor } from './core/Interceptor/loading-interceptor';
import { environment } from '../environments/environment';
import { MatCardModule} from '@angular/material/card';
import { MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from "ngx-spinner";
// import { FormsModule } from '@angular/forms';


/** Http interceptor providers  */
export const interceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    // ImageCropperModule,

    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule,
    PipesModule,
    MatDialogModule,
    MatCardModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [interceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

