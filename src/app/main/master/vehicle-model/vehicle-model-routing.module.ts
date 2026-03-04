import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleMasterComponent } from './vehicle-master/vehicle-master.component';

const routes: Routes = [
  {
    path:'',
   component: VehicleListComponent
  },
  {
    path:'vechile-master',
   component: VehicleMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleModelRoutingModule { }
