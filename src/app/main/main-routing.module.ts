//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatteryPercentageComponent } from './battery-percentage/battery-percentage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { MinimumWalletBalanceComponent } from './minimum-wallet-balance/minimum-wallet-balance.component';
import { UserTransactionComponent } from './user-transaction/user-transaction.component';
import { UserWalletDetailsComponent } from './user-wallet-details/user-wallet-details.component';
import { UserWalletComponent } from './user-wallet/user-wallet.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { ZoneMapComponent } from './zone-map/zone-map.component';
import { GeoFencingComponent } from './geo-fencing/geo-fencing.component';
import { TestLockComponent } from './test-lock/test-lock.component';
import { DashboardMapComponent } from './dashboard-map/dashboard-map.component';
import { AdminAuthGuard } from '../core/guard/admin-auth';
import { VersionUpdateComponent } from './version-update/version-update.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MainComponent,
        canActivate: [AdminAuthGuard]
        , children: [
          // { path: '', redirectTo: 'home', pathMatch: 'full' }
          { path: 'card', component:DashboardComponent },
          { path: '', component:DashboardMapComponent },
          { path: 'user-transaction', component: UserTransactionComponent},
          { path: 'user', loadChildren: () => import('./user-details/user-details.module').then(u => u.UserDetailsModule) },
          { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule) },
          { path: 'allotment', loadChildren: () => import('./allotment-list/allotment-list.module').then(a => a.AllotmentListModule) },
          { path: 'inward', loadChildren: () => import('./inward/inward.module').then(i => i.InwardModule) },
          { path: 'produce', loadChildren: () => import('./produce-bike/produce-bike.module').then(p => p.ProduceBikeModule) },
          { path: 'bookingData', loadChildren: () => import('./booking-data/booking-data.module').then(b => b.BookingDataModule) },
          { path: 'report', loadChildren: () => import('./report/report.module').then(r => r.ReportModule) },
          { path: 'user-wallet', component: UserWalletComponent},
          { path: 'user-wallet-details', component: UserWalletDetailsComponent},
          { path: 'withdraw-request', component: WithdrawRequestComponent},
          { path: 'battery-percentage', component: BatteryPercentageComponent},
          { path: 'SetMWBC', component: MinimumWalletBalanceComponent},
          { path: 'zoneMap', component: ZoneMapComponent},
          { path: 'geo', component: GeoFencingComponent},
          { path: 'lock', component: TestLockComponent},
          { path: 'VersionUpdate', component: VersionUpdateComponent},

        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule {
  constructor() {
  }
}
