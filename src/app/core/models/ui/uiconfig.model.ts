//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { IUiConfig } from '../../interfaces/uiconfig';

export class Uiconfig implements IUiConfig {
  displayKey: string;
  disabled: boolean;
  key: string;
  label: string;
  multiple: boolean = false
  required: boolean = false


}
