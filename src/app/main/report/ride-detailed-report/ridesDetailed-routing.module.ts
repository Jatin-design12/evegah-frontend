import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';   
import { RidesDetailedComponent } from './rides-detailed/rides-detailed.component';

const routes: Routes = [
  {
    path:'',
   component: RidesDetailedComponent
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RidesDetailedRoutingModule { }
