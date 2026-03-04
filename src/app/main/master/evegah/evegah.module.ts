import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared/shared.modules';
import { EvegahRoutingModule } from './evegah-routing.module';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { DeviceListComponent } from './device-list/device-list.component';



@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceDetailComponent
  ],
  imports: [
    CommonModule,
    EvegahRoutingModule,
    SharedModule
  ]
})
export class EvegahModule { }
