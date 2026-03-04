import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleModelRoutingModule } from './vehicle-model-routing.module';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleMasterComponent } from './vehicle-master/vehicle-master.component';
import { SharedModule } from 'src/app/shared/shared.modules';


@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleMasterComponent
  ],
  imports: [
    CommonModule,
    VehicleModelRoutingModule,
    SharedModule,
  ]
})
export class VehicleModelModule { }
