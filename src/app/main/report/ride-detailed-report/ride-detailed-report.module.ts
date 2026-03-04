import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RidesDetailedComponent } from './rides-detailed/rides-detailed.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { RidesDetailedRoutingModule } from './ridesDetailed-routing.module';
import { DateAdapter } from '@angular/material/core';
import { DateFormat } from '../date-format';



@NgModule({
  declarations: [
    RidesDetailedComponent
  ],
  imports: [
    CommonModule,
    RidesDetailedRoutingModule,
    SharedModule
  ],
  providers: [{ provide: DateAdapter, useClass: DateFormat , }, DatePipe],

})
export class RideDetailedReportModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
 }
