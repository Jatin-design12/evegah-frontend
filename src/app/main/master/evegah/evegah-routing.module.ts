import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { userAccess } from 'src/app/core/constants/common-constant';
//import { UserAccessControlAuthGuard } from 'src/app/core/guard/user-access-control-auth';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { DeviceListComponent } from './device-list/device-list.component';


const routes: Routes = [
  {
    path:'',
    component:DeviceListComponent ,
  },
  {
    path:'detail',
    component:DeviceDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvegahRoutingModule { }
