
//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component, ElementRef, Input, OnInit, Self, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Input() type = 'text';
  @Input() label: string;
  @Input() hint: string;
  @Input() required: Boolean = false
  @Input() readonly: boolean = false
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() disabled: boolean = false;
  @Input() focus = false;
  constructor(@Self() public controlDir: NgControl) {
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
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty("focus")) {
      if (changes.focus.currentValue === true) {
        this.input.nativeElement.focus();
      }
    }
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
    this.disabled = isDisabled;
  }
}
