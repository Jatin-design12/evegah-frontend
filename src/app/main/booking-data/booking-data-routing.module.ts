import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingDataListComponent } from './booking-data-list/booking-data-list.component';

const routes: Routes = [
  {
    path:'list',
    component: BookingDataListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingDataRoutingModule { }
