import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { RideRatingComponent } from './ride-rating/ride-rating.component';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  {
    path:'',
   component: UserDetailsComponent
  },
  {
    path:'ride-rating',
   component: RideRatingComponent
  },
  {
    path:'faq',
    component: FaqComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDetailsRoutingModule { }
