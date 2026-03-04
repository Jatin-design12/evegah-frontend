import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  
import { FarePlanListComponent } from './fare-plan-list/fare-plan-list.component';
import { FarePlanMasterComponent } from './fare-plan-master/fare-plan-master.component';

const routes: Routes = [
  {
    path:'',
   component: FarePlanListComponent
  },
  {
    path:'fare-master',
   component: FarePlanMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class farePlanRoutingModule { }
