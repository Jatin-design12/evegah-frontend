import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ZoneRoutingModule } from './zone-routing.module';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { ZoneMasterComponent } from './zone-master/zone-master.component';
import { SharedModule } from 'src/app/shared/shared.modules';
@NgModule({
  declarations: [
    ZoneListComponent,
    ZoneMasterComponent   
  ],
  imports: [
    CommonModule,
    ZoneRoutingModule,
    SharedModule
  ]
})
export class ZoneModule { }
