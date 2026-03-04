//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component, ElementRef, Input, OnInit, Renderer2, Self, ViewChild, ViewChildren, } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatRadioButton } from '@angular/material/radio';

import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit {
  @ViewChildren('button') radioBtn: any
  @Input() items: any; // radio value
  @Input() config: Uiconfig
  selected: any;
  @Input() disabled: boolean = false;
  constructor(@Self() public controlDir: NgControl, private render: Renderer2) {
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
    if (obj === null) {
      if (this.radioBtn !== undefined) {
        if (this.radioBtn._results.length > 0) {
          for (let i = 0; i < this.radioBtn._results.length; i++) {
                       
            // this.render.removeClass(this.radioBtn._results[i]['_elementRef'].nativeElement, 'mat-radio-checked');
            //  this.render.removeClass(this.radioBtn._results[i]['_elementRef'].nativeElement, 'cdk-focused');
            //  this.render.removeClass(this.radioBtn._results[i]['_elementRef'].nativeElement, 'cdk-program-focused');
            // this.render.addClass(this.radioBtn._results[i]['_elementRef'].nativeElement, 'mat-radio-button radio-button ')

          }
        }
      }
    } else {
      this.selected = obj
    }

  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
