import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { SharedModule } from 'src/app/shared/shared.modules';
import { SectionComponent } from './section/section.component';

@NgModule({
  declarations: [
  
    SectionComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule ,
    
  ]
})
export class MasterModule { }
