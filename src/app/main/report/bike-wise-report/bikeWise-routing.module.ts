import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';    
import { BikeWiseListComponent } from './bike-wise-list/bike-wise-list.component';
import { BikedetailsComponent } from './bikedetails/bikedetails.component';

const routes: Routes = [
  {
    path:'',
   component: BikeWiseListComponent
  }, 
  {
    path:'bikeDetails',
   component: BikedetailsComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BikeWiseRoutingModule { }
