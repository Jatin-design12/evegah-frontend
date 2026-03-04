import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AreaListComponent } from './area-list/area-list.component';
import { AreaMasterComponent } from './area-master/area-master.component';

const routes: Routes = [
  {
    path:'',
   component: AreaListComponent
  },
  {
    path:'area-master',
   component: AreaMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class areaRoutingModule { }
