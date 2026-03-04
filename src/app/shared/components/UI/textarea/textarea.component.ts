//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {
  @Input() readonly: boolean = false

  @Input() label: string;
  @ViewChild('input', { static: true }) input: ElementRef;
  disabled: boolean = false;
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
    this.input.nativeElement.value = obj || '';

  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled= isDisabled;
  }
}
