
//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes : Routes = [
  { path:'',
  loadChildren:() => import('./employee/employee.module').then(e => e.EmployeeModule)
}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsRoutingModule { }
