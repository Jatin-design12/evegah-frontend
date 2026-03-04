import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaListComponent } from './area-list/area-list.component';
import { AreaMasterComponent } from './area-master/area-master.component';
import { areaRoutingModule } from './area-routing.module';
import { SharedModule } from 'src/app/shared/shared.modules';



@NgModule({
  declarations: [
    AreaListComponent,
    AreaMasterComponent
  ],
  imports: [
    CommonModule,
    areaRoutingModule,
    SharedModule
  ]
})
export class AreaModule { }
