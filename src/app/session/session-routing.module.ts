import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminAuthGuard } from '../core/guard/admin-auth';
import { NewResetPasswordComponent } from './new-reset-password/new-reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'resetPassword',
    component: NewResetPasswordComponent//ResetPasswordComponent
  },
  {
    path: 'newResetPassword/:id',
    component: NewResetPasswordComponent
  },
  {
    path: 'main',
    loadChildren: () => import('../main/main.module').then(m => m.MainModule),
  },
  {
    path:'evegah', 
    loadChildren:() => import('../main/master/evegah/evegah.module').then(e => e.EvegahModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
