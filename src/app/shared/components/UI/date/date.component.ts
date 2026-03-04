//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component,  EventEmitter,  Input, OnInit, Output, Self, } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {
  selected:Date;

  @Input() label: string;
  @Input() minDate : Date
  @Input() maxDate : Date
  @Output() dateChange = new EventEmitter<any>();
  disabled = false;
  constructor(@Self()public controlDir: NgControl) {
  this.controlDir.valueAccessor = this;

  }



  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];
    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();

  }
  onChange(event) {
   }
  onTouched() {
   }
  writeValue(obj: any): void {
    this.selected =  obj
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  onDateChange(event){
    this.dateChange.emit(event);
  }
}
