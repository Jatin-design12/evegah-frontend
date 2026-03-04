import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/core/services/spinner.services';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor(public spinner: SpinnerService) { }

  ngOnInit(): void {
  
    this.spinner.isVisible().subscribe((res)=>{
      console.log('spinner',res);
    })
  }

}
