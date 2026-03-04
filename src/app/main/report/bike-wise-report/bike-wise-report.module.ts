import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BikeWiseListComponent } from './bike-wise-list/bike-wise-list.component';
import { BikedetailsComponent } from './bikedetails/bikedetails.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { BikeWiseRoutingModule } from './bikeWise-routing.module';
import { DateAdapter } from '@angular/material/core';
import { DateFormat } from '../date-format';



@NgModule({
  declarations: [
    BikeWiseListComponent,
    BikedetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BikeWiseRoutingModule
  ],
  providers: [{ provide: DateAdapter, useClass: DateFormat , }, DatePipe],
})
export class BikeWiseReportModule { 
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
}
