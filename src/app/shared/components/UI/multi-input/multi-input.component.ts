//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component, forwardRef, Input, OnDestroy, OnInit ,Self} from '@angular/core';
import { ControlValueAccessor, NgControl,FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IUiConfig } from 'src/app/core/interfaces/uiconfig';
@Component({
  selector: 'app-multi-input',
  templateUrl: './multi-input.component.html',
  styleUrls: ['./multi-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiInputComponent),
      multi: true
    }
  ]
})
export class MultiInputComponent implements OnInit ,ControlValueAccessor, OnDestroy{
  multiInputForm: FormGroup;
  subscriptions: Subscription[] = [];
  @Input() items: any; // dropdown value
  @Input() config: IUiConfig
  @Input() label: string;
  @Input() type: string;
  @Input() ControlName : string
  @Input() required :boolean = false
  @Input() disabled :boolean = false
  multipleItems: any = [];
  constructor(private formBuilder: FormBuilder) {

 //   this.controlDir.valueAccessor = this;
 //   this.multipleItems = this.items;
   }

  ngOnInit(): void {
    this.multiInputForm = this.formBuilder.group({
      input: [],
      dropdown: []
    })
    if(this.required){
      this.multiInputForm.controls.input.setValidators([Validators.required])
      this.multiInputForm.controls.dropdown.setValidators([Validators.required])
    }
    if(this.disabled){
      this.multiInputForm.disable()
    }
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.multiInputForm.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  get value() {
    return this.multiInputForm.value;
  }

  set value(value) {
    this.multiInputForm.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.multiInputForm.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  get input() { return this.multiInputForm.get('input'); }
  get dropdown() { return this.multiInputForm.get('dropdown'); }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.multiInputForm.valid ? null : { [this.ControlName]: { valid: false } };
  }
  // onSearch(val) {
  //   this.multipleItems = this.searchData(val)
  // }
  // searchData(value:string) {
  //   return this.items.filter((data) => data[this.config.displayKey].toLowerCase().indexOf(value.toLowerCase()) !== -1);
  //  }

}


