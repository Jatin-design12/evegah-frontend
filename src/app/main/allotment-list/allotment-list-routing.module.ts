import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentListComponent } from './allotment-list/allotment-list.component';

const routes: Routes = [
  {
    path:'',
   component: AllotmentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentListRoutingModule { }