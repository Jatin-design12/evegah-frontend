import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { UserWiseRoutingModule } from './userWise-routing.module';
import { MaterialModule } from 'src/app/core/modules/material.module';
import { DateAdapter } from '@angular/material/core';
import { DateFormat } from '../date-format';



@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    UserWiseRoutingModule,
    SharedModule,
    MaterialModule,
  ],
  providers: [{ provide: DateAdapter, useClass: DateFormat , }, DatePipe],
})
export class UserWiseReportModule { 
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
}
