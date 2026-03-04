//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Input, Output, EventEmitter, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() class: string;
  @Input() iconClass: string;
  @Output() onClick = new EventEmitter<any>();
  @Input() disabled: boolean = false;
  @Input() showLoader: boolean = false;
  @Input() showIcon: boolean = false;
  @Input() iconName: string;
  disableValue: boolean
  constructor() {
  }

  ngOnInit(): void {
    this.disableValue = this.disabled
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('disabled')) {
      this.disableValue = changes.disabled.currentValue
    }
  }
  onClickButton(event) {
    this.onClick.emit(event);

  }

}
