import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityListComponent } from './city-list/city-list.component';
import { CityMasterComponent } from './city-master/city-master.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { cityRoutingModule } from './city-routing.module';



@NgModule({
  declarations: [
    CityListComponent,
    CityMasterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    cityRoutingModule
  ]
})
export class CityModule { }
