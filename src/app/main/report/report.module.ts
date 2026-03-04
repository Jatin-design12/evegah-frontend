import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.modules';
import { ReportRoutingModule } from './report-routing.module';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { DateAdapter } from '@angular/material/core';

import { DateFormat } from "./date-format";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule,
    MaterialModule,
  
  ],
   providers: [{ provide: DateAdapter, useClass: DateFormat , }, DatePipe],
})
export class ReportModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
 }
