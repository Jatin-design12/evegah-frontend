//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './search.pipe';
import { SafePipe } from './safe.pipe';

const pipes = [
  SearchPipe,
  SafePipe,
];

@NgModule({
  imports: [CommonModule],
  declarations: [SafePipe],
  exports: [SafePipe],
})
export class PipesModule {}
