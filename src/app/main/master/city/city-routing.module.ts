import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { CityListComponent } from './city-list/city-list.component';
import { CityMasterComponent } from './city-master/city-master.component';

const routes: Routes = [
  {
    path:'',
   component: CityListComponent
  },
  {
    path:'city-master',
   component: CityMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class cityRoutingModule { }
