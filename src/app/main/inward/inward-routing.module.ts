import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InwardListComponent } from './inward-list/inward-list.component';
import { InwardMasterComponent } from './inward-master/inward-master.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { LockComponent } from './lock/lock.component';

const routes: Routes = [
  {
    path:'',
   component: InwardListComponent
  },
  // {
  //   path:'inward-master',
  //  component: InwardMasterComponent
  // },
  {
    path:'vehicle',
   component: VehicleComponent
  },
  {
    path:'lock',
   component: LockComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardRoutingModule { }
