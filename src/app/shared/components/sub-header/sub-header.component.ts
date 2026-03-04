//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
  @Output() onClick = new EventEmitter<any>();
  @Output() onBackIcon = new EventEmitter<any>();
  @Input() heading: string
  @Input() walletAmount:number;
  @Input() creditAmount:number;
  @Input() icon: string
  @Input() buttonLabel: string
  @Input() showButton : boolean ;
  constructor() { }

  ngOnInit(): void {
  }

  onClickButton(event) {
    this.onClick.emit(event);
  }
  backButton(event){
this.onBackIcon.emit(event);
  }
}
