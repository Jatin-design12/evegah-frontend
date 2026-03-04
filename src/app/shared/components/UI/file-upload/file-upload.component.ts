//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {



  @Input() label: string;
  @Input() fileType :string  = 'image/jpeg, image/png';
  @Input() multiple:boolean = false;
  @Output() change = new EventEmitter<any>();
  disabled: boolean = false;
  // fileType :string = 'image/*'
  @Input() class: string = 'defaultColor'
  constructor(@Self()public controlDir: NgControl) {
  this.controlDir.valueAccessor = this;

  }



  ngOnInit(): void {
    // this.fileType = this.accept
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];
    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();

  }
  onChange() {
   }
  onTouched() {
   }
  writeValue(obj: any): void {
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

  changeEvent(event){
    this.change.emit(event);

  }
}
