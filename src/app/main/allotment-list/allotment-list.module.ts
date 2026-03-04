import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllotmentListRoutingModule } from './allotment-list-routing.module';
import { AllotmentListComponent } from './allotment-list/allotment-list.component';
import { SharedModule } from 'src/app/shared/shared.modules';


@NgModule({
  declarations: [
    AllotmentListComponent
  ],
  imports: [
    CommonModule,
    AllotmentListRoutingModule,
    SharedModule
  ]
})
export class AllotmentListModule { }
