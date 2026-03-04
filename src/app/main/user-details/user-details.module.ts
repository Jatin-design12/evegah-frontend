import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UserDetailsRoutingModule } from './user-details-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { RideRatingComponent } from './ride-rating/ride-rating.component';
import { DateAdapter } from '@angular/material/core';
import { DateFormat } from '../report/date-format';
import { FaqComponent } from './faq/faq.component';


@NgModule({
  declarations: [
    UserDetailsComponent,
    RideRatingComponent,
    FaqComponent
  ],
  imports: [
    CommonModule,
    UserDetailsRoutingModule,
    SharedModule
  ],
  providers: [{ provide: DateAdapter, useClass: DateFormat }, DatePipe],
})
export class UserDetailsModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
 }
