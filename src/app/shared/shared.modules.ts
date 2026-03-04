import { PipesModule } from './../core/pipes/pipes.module';
import { SafePipe } from './../core/pipes/safe.pipe';

//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToastrModule } from "ngx-toastr";
import { LayoutModule } from "src/app/layout/layout.module";
import { MaterialModule } from "../core/modules/material.module";
import { UiModule } from "./components/UI/ui.module";
import { SharedComponents } from "./components/components";
import { ExportDirective } from "../core/directives/excel-export.directive";

declare let google: any;
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),

  ],
  exports: [
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    FormsModule,
    UiModule,
    ExportDirective,
    PipesModule,
    ...SharedComponents,

  ],
  providers: [],
  declarations: [...SharedComponents, ExportDirective],

})
export class SharedModule {
}
