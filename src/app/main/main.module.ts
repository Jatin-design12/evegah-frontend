import { LayoutModule } from 'src/app/layout/layout.module';
//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================
import { SharedModule } from '../shared/shared.modules';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PopUpComponent } from '../shared/components/pop-up/pop-up.component';
import { DatePipe } from '@angular/common';
import { UserWalletComponent } from './user-wallet/user-wallet.component';
import { UserWalletDetailsComponent } from './user-wallet-details/user-wallet-details.component';

import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { SearchPipe } from '../core/pipes/search.pipe';
import { UserTransactionComponent } from './user-transaction/user-transaction.component';
import { BatteryPercentageComponent } from './battery-percentage/battery-percentage.component';
import { MinimumWalletBalanceComponent } from './minimum-wallet-balance/minimum-wallet-balance.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserTansactionDetailComponent } from '../shared/components/user-tansaction-detail/user-tansaction-detail.component';
import { BikeMaintanceComponent } from '../shared/components/bike-maintance/bike-maintance.component';
import { ZoneMapComponent } from './zone-map/zone-map.component';
import { GeoFencingComponent } from './geo-fencing/geo-fencing.component';
import { TestLockComponent } from './test-lock/test-lock.component';
import { HistoryInfoComponent } from '../shared/components/history-info/history-info.component';
import { TestLockHistoryInfoComponent } from './test-lock-history-info/test-lock-history-info.component';
import { DateFormat } from './report/date-format';
import { DateAdapter } from '@angular/material/core';
import { TrackVehicleStandComponent } from '../shared/components/track-vehicle-stand/track-vehicle-stand.component';
import { DashboardMapComponent } from './dashboard-map/dashboard-map.component';
import { DashboardMapBikeModalComponent } from './dashboard-map-bike-modal/dashboard-map-bike-modal.component';
import { AdminAuthGuard } from '../core/guard/admin-auth';
import { RatingReplyComponent } from '../shared/components/rating-reply/rating-reply.component';
import { LocateButtonModalComponent } from './locate-button-modal/locate-button-modal.component';
import { FaqReOrderComponent } from '../shared/components/faq-re-order/faq-re-order.component';
import { RechargeWalletModalComponent } from '../shared/components/recharge-wallet-modal/recharge-wallet-modal.component';
import { VersionUpdateComponent } from './version-update/version-update.component';
// import {UserTansactionDetailComponent} from '../shared/components/user-tansaction-detail'
@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    PopUpComponent,
    UserWalletComponent,
    UserWalletDetailsComponent,
    WithdrawRequestComponent,
    BatteryPercentageComponent,
    SearchPipe,
    UserTransactionComponent,
    BatteryPercentageComponent,
    MinimumWalletBalanceComponent,
    VersionUpdateComponent,
    UserTansactionDetailComponent,
    BikeMaintanceComponent,
    ZoneMapComponent,
    GeoFencingComponent,
    TestLockComponent,
    HistoryInfoComponent,
    TestLockHistoryInfoComponent,
    TrackVehicleStandComponent,
    DashboardMapComponent,
    DashboardMapBikeModalComponent,
    RatingReplyComponent,
    LocateButtonModalComponent,
    FaqReOrderComponent,
    RechargeWalletModalComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    MainRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [],
  providers: [{ provide: DateAdapter, useClass: DateFormat, }, DatePipe, AdminAuthGuard],
  entryComponents: []
})
export class MainModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
}
