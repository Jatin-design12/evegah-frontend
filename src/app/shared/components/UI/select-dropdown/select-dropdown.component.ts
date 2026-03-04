
//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 3 June 2021
//==============================================================================

import { Component, EventEmitter, Input, OnInit, Output, Self, SimpleChanges, ViewChild, } from '@angular/core';
import { ControlValueAccessor, NgControl, NgModel } from '@angular/forms';
import { MatOption } from '@angular/material/core/option';
import { MatSelect } from '@angular/material/select';
import { IUiConfig } from 'src/app/core/interfaces/uiconfig';




@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss']
})
export class SelectDropdownComponent implements OnInit, ControlValueAccessor {
  @Input() items: any; // dropdown value
  @Input() config: IUiConfig
  @Input() required: boolean = false;
  @ViewChild('select', { static: true }) select: MatSelect;
  @Output() selectionChange = new EventEmitter<any>();
  selectedItems: any = [];
  selected: any;
  disabled: boolean = false;
  @Input() model: NgModel;
  @Input() values = [];
  @Input() text = 'Select All';
  selectionModel:any
  selectedngModel:any
  allSelect:boolean = false
  @Input() selectAllCheck: boolean= false   // @ViewChild('select') select: MatSelect;


  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
    this.selectedItems = this.items;


  }



  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];
    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
    // this.config.re
    //this.selectedItems = [...this.items];

  }
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.items !== undefined) {
      // console.log(changes.items, 'changes from select', this.config.label);
      this.selectedItems = changes.items.currentValue;
    }
  }
  onChange(event) {
    this.selectedItems = [...this.items];
  }
  onTouched() { }
  writeValue(obj: any): void {
    this.selected = obj;

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
  onSearch(val) {
    this.selectedItems = this.searchData(val)
  }

  onSelectionChange(event) {
    this.selectionChange.emit(event);
  }
  searchData(value: string) {

    console.log('return', this.items.filter((data) => data[this.config.displayKey].toLowerCase().indexOf(value.toLowerCase()) !== -1))
    return this.items.filter((data) => data[this.config.displayKey].toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  // isChecked(): boolean {
  //   return this.model.value && this.values.length
  //     && this.model.value.length === this.values.length;
  // }

  // isIndeterminate(): boolean {
  //   return this.model.value && this.values.length && this.model.value.length
  //     && this.model.value.length < this.values.length;
  // }

  // toggleSelection(change: MatCheckboxChange): void {
  //   if (change.checked) {
  //     this.model.update.emit(this.values);
  //   } else {
  //     this.model.update.emit([]);
  //   }
  // }

  selectAll(){

  //  console.log(this.selectedItems,"data");
   if(this.allSelect){
     console.log("if ", this.select)
    this.select.options.forEach((item: MatOption) => item.select());
   }
   else {
    console.log("else ", this.select)

    this.select.options.forEach((item: MatOption) => item.deselect());
   }

  }

  

}


