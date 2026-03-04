import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProduceBikeRoutingModule } from './produce-bike-routing.module';
import { ProduceBikeComponent } from './produce-bike/produce-bike.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { QrModelComponent } from './qr-model/qr-model.component';


@NgModule({
  declarations: [
    ProduceBikeComponent,
    QrModelComponent
  ],
  imports: [
    CommonModule,
    ProduceBikeRoutingModule,
    SharedModule
  ]
})
export class ProduceBikeModule { }
