import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarePlanListComponent } from './fare-plan-list/fare-plan-list.component';
import { FarePlanMasterComponent } from './fare-plan-master/fare-plan-master.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { farePlanRoutingModule } from './farePlan-routing.module';



@NgModule({
  declarations: [
    FarePlanListComponent,
    FarePlanMasterComponent
  ],
  imports: [
    CommonModule,
    farePlanRoutingModule,
    SharedModule
  ]
})
export class FarePlanModule { }
