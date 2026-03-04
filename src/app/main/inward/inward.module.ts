import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { InwardRoutingModule } from './inward-routing.module';
import { InwardListComponent } from './inward-list/inward-list.component';
import { InwardMasterComponent } from './inward-master/inward-master.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { ChangeStatusComponent } from './change-status/change-status.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { LockComponent } from './lock/lock.component';
import { DateAdapter } from '@angular/material/core';
import { DateFormat } from '../report/date-format';


@NgModule({
  declarations: [
    InwardListComponent,
    InwardMasterComponent,
    ChangeStatusComponent,
    VehicleComponent,
    LockComponent
  ],
  imports: [
    CommonModule,
    InwardRoutingModule,
    SharedModule
  ],
  providers: [ { provide: DateAdapter, useClass: DateFormat , },DatePipe],
})
export class InwardModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
 }
