import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { EDIT, VIEW ,toggle, DATE_TIME_FORMAT} from 'src/app/core/constants/common-constant';
import { BikeModelService } from 'src/app/core/services/BikeInward/bikeInward.service';
import { LockService } from 'src/app/core/services/lockInward/lockInward.service'
@Component({
  selector: 'app-inward-list',
  templateUrl: './inward-list.component.html',
  styleUrls: ['./inward-list.component.scss']
})
export class InwardListComponent implements OnInit {

  subscription: Subscription[] = [];
  rowData = [];
  lockInwardData = [];
  cols = [];
  cols2 = [];
 
  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private BikeService: BikeModelService,
    private LockService: LockService , 
   ) { }

  ngOnInit(): void {
    this.getBikeInward();
    this.getLockInward();
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'createdOnDate',
        display: 'Date',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT}
      },
      {
        key: 'modelName',
        display: 'Model',
        sort: true,
      },
      {
        key: 'vehicleModelUId',
        display: 'UID',
        sort: true,
      },
      {
        key: 'bikeStatusName',
        display: 'Allotted Status',
        sort: true,
      }, 
      {
        key: 'toggleStatus',
        display: 'Action',
        sort: false,
        config: { trueFalseAction: true , actions: [toggle]},
      }
    ];
    this.cols2 = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'createdOnDate',
        display: 'Date',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'lockNumber',
        display: 'IOT Device ID',
        sort: true,
      },
      {
        key: 'lockIMEINumber',
        display: 'IOT Device  IMEI Number',
        sort: true,
      },
      {
        key: 'allottedStatusName',
        display: 'Allotted Status',
        sort: true,
      }, 
      {
        key:'registrationStatus',
        display:'registration Status',
        sort: true
      },
      {
        key: 'toggleStatus',
        display: 'Action',
        sort: false,
        config: { trueFalseAction: true , actions: [toggle]},
      }
    ];
  }

  getBikeInward() {
    this.spinner.show();
    this.subscription.push(this.BikeService.getBikeModelDetails(0,0,0).subscribe((res) => {
      if (res.statusCode === 200) {
        this.rowData = res.data;
        this.spinner.hide();
        this.rowData.forEach( (ele , index)=> {
          if(ele.statusEnumId === "1"){

            this.rowData[index].toggleStatus = true;
          
          }else{
           
            this.rowData[index].toggleStatus = false;
          }           
        });
       
        //this.getLockInward();
      } 
    }))
  }

  getLockInward() {
    this.spinner.show();
    this.subscription.push(this.LockService.getLockDetails(0,0).subscribe((res) => {
      if (res.statusCode === 200) {
        this.lockInwardData = res.data;
        this.spinner.hide();
        res.data.forEach((ele , index)=> {
          if(ele.statusEnumId === '1'){
            this.lockInwardData[index].toggleStatus = true;
          }else{
            this.lockInwardData[index].toggleStatus = false;
          }           
        });    
      } 
    }))
  }

  onActionHandler(event){
  
    if(event.data.bikeInwardId){
      if(Number( event.data.statusEnumId) === 1 ){
        const bikeAllotment = {
          "statusEnumId":2,
          "bikeInwardId":  Number(event.data.bikeInwardId)
        }
        this.activeInactiveBikeInward(bikeAllotment)
      }else{
        const bikeAllotment = {
          "statusEnumId":1,
          "bikeInwardId": Number( event.data.bikeInwardId)
        }
        this.activeInactiveBikeInward(bikeAllotment)
      }
      
    }
   
    //lock
    
    if(event.data.lockInwardId){
      if(Number( event.data.statusEnumId) === 1 ){
        const lockAllotment = {
          "statusEnumId":2,
          "lockInwardId": Number( event.data.lockInwardId)
        }
        this.changeLockStatus(lockAllotment)
      }else{
        const lockAllotment = {
          "statusEnumId":1,
          "lockInwardId":  Number( event.data.lockInwardId)
        }
        this.changeLockStatus(lockAllotment)
      }
    }
  }

  activeInactiveBikeInward(data){
    this.subscription.push(this.BikeService.activeInactiveBikeInward(data).subscribe((res) => {
      if (res.statusCode === 200) {
      
        this.getBikeInward();
      } 
    }))
  }

  changeLockStatus(data){
    this.subscription.push(this.LockService.changeLockStatus(data).subscribe((res) => {
      if (res.statusCode === 200) {
       
       this.getLockInward();
      } 
    }))
  }

  navigateToMaster(event) {
    this.router.navigate(['./main/inward/inward-master'])
  }
}
