import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.modules';
import { BookingDataRoutingModule } from './booking-data-routing.module';
import { BookingDataListComponent } from './booking-data-list/booking-data-list.component';
@NgModule({
  declarations: [
  
    BookingDataListComponent
  ],
  imports: [
    CommonModule,
    BookingDataRoutingModule,
    SharedModule 
  ]
})
export class BookingDataModule { }
