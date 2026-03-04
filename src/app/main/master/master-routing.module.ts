import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectionComponent } from './section/section.component';

const routes: Routes = [
  {
    path: 'city',
    loadChildren: () => import('./city/city.module').then(c => c.CityModule)
  },
  {
    path: 'area',
    loadChildren: () => import('./area/area.module').then(v => v.AreaModule)
  },
  {
    path: 'zone',
    loadChildren: () => import('./zone/zone.module').then(z => z.ZoneModule)
  },
  {
    path: 'vehicle',
    loadChildren: () => import('./vehicle-model/vehicle-model.module').then(v => v.VehicleModelModule)
  },
  {
    path:'fare-plan',
    loadChildren:() => import('./fare-plan/fare-plan.module').then(f => f.FarePlanModule) 
  },
  {path:'section', component: SectionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
