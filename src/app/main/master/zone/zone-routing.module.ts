import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { ZoneMasterComponent } from './zone-master/zone-master.component';

const routes: Routes = [
  {
    path:'',
   component: ZoneListComponent
  },
  {
    path:'zone-master',
   component: ZoneMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoneRoutingModule { }
