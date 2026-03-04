import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { SessionRoutingModule } from './session-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { SharedModule } from '../shared/shared.modules';
import { AdminAuthGuard } from '../core/guard/admin-auth';
import { NewResetPasswordComponent } from './new-reset-password/new-reset-password.component';


@NgModule({
  declarations: [
    LoginPageComponent,
    ResetPasswordComponent,
    NewResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    FormsModule,
    SharedModule

  ],
  providers: [AdminAuthGuard]
})
export class SessionModule { }
