import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduceBikeComponent } from './produce-bike/produce-bike.component';

const routes: Routes = [
  {
    path:'',
   component: ProduceBikeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduceBikeRoutingModule { }
