import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'userWise',
    loadChildren: () => import('./user-wise-report/user-wise-report.module').then(u => u.UserWiseReportModule)
  },
  {
    path: 'bikeWise',
    loadChildren: () => import('./bike-wise-report/bike-wise-report.module').then(b => b.BikeWiseReportModule)
  },
  {
    path: 'ridesDetails',
    loadChildren: () => import('./ride-detailed-report/ride-detailed-report.module').then(r => r.RideDetailedReportModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
