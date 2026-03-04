import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';

@Component({
  selector: 'app-bike-inward',
  templateUrl: './bike-inward.component.html',
  styleUrls: ['./bike-inward.component.scss']
})
export class BikeInwardComponent implements OnInit {
  inwardForm: FormGroup;
  modal = new Uiconfig(); 
  constructor(public formBuilder: FormBuilder,) { }
  ngOnInit(): void {
    this.setFormControls()
    this.setDefaultConfig()
  }
  setFormControls() {
    this.inwardForm = this.formBuilder.group({
      val: [''],
      name: [''],
      date: [''],
    });
  }
  setDefaultConfig(){
    // modal
    this.modal.label = 'Select Model';
    this.modal.multiple = true;
  }
}
