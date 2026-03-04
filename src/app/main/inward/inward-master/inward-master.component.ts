

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EDIT, VIEW } from 'src/app/core/constants/common-constant';
import { BikeModelService } from 'src/app/core/services/BikeInward/bikeInward.service';
import { LockService} from 'src/app/core/services/lockInward/lockInward.service'
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { LockInward } from 'src/app/core/models/inward/lock-inward-model';
import { ILockListData } from 'src/app/core/interfaces/lockInward/list-data';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { VehicleModelService} from '../../../core/services/vehicle.service';
import { MatDialog } from '@angular/material/dialog';
import { ifError } from 'assert';

@Component({
  selector: 'app-inward-master',
  templateUrl: './inward-master.component.html',
  styleUrls: ['./inward-master.component.scss']
})
export class InwardMasterComponent implements OnInit , OnDestroy{
  heading: string = 'Inward Master';
  counter: any;
  bikeinwardForm: FormGroup;
  lockInwardForm: FormGroup;
  modal = new Uiconfig(); 
  tableData: any = [];
  lockInwardModel= new  LockInward();
  lockListData:ILockListData[] = [];
  lockInwardupdateButton:boolean = false;
  lockInwardAddButton:boolean = true;
  editedId: any;
  viewMode: boolean = false;
  lockInwardData = [];
  bankDetailsEditIndex: number;
  subscription: Subscription[] = [];
  cols = [];
  cols2= [];
  vehicleModel = [];
  BikeModelDetails = [];
  constructor(public formBuilder: FormBuilder, public router: Router,
    private BikeService: BikeModelService,
    private LockService: LockService ,public dialog: MatDialog,
    private toastr: ToastrService,
    private  VehicleModel: VehicleModelService) { }

  ngOnInit(): void {
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'inwardDate',
        display: 'Date',
        sort: true,
        config: { isDate: true, format:'dd-MM-yyyy'},
      },
      {
        key: 'modelName',
        display: 'Model Number',
        sort: true,
      },
      {
        key: 'vehicleModelUId',
        display: 'UID',
        sort: true,
      },

      // {
      //   key: 'action',
      //   display: 'Action',
      //   sort: false,
      //   config: { isAction: true, actions: [EDIT] },
      // }
    ];
    this.cols2 = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'inwardDate',
        display: 'Date',
        sort: true,
        config: { isDate: true, format:'dd-MM-yyyy'},
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
      // {
      //   key:'registrationStatus',
      //   display:'registration Status',
      //   sort: true,
      // },
      {
        key:'counter',
        display:'Timer',
        sort: true,
        
      },
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isAction: true, actions: [EDIT] },
      }
    ];
    this.getBikeInward();
    this.getVehicleList();
    this.setFormControls();
    this.setDefaultConfig();
   // this.getLockInward();  
   this.getLockInwardinstruction()
  }

  setFormControls() {
   
    this.bikeinwardForm = this.formBuilder.group({
      bikeInwardId: 0,
      inwardDate: [''],
      vehicleId: 3,
      vehicleModelUId: [''],
      statusEnumId: 1,
      remark: "not yet ",
      actionByLoginUserId:[3],
      actionByUserTypeEnumId:[3]
    });
   
    this.lockInwardForm  = this.formBuilder.group({
      lockInwardId: [0],
      lockNumber: [,[Validators.required] ],
      lockIMEINumber: [,[Validators.required]],
      inwardDate: [,[Validators.required]],
      statusEnumId: [1],
      instructionId:[1],
      remark: "not yet ",
      actionByLoginUserId:[3],
      actionByUserTypeEnumId:[3]
    });


  }

  setDefaultConfig(){

     // modal
     this.modal.label = 'Select Model';
     this.modal.displayKey = 'modelName';
     this.modal.key = 'vehicleId';
     this.modal.multiple = false;
  }

  addBikeInward() {
    this.subscription.push(this.BikeService.bikeModelDetails(this.bikeinwardForm.value).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message);
        this.bikeinwardForm.reset();
        this.getBikeInward();
      } else {
        this.toastr.warning(res.message);
      }
    }))
  }

  timer(minute) {
    let seconds: number = minute * 60;
    let milisec : string ;
    let textSec: any = '0';
    let statSec = 60;
    console.log("seconds",seconds);
    console.log("minute",minute)
    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec !== 0) {
        statSec--;
      } else {
        statSec = 59;
      }

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else {
        textSec = statSec;
      }
      
     
      milisec = (seconds/60).toFixed(2).toString().split('.')[1];
    //  this.counter = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
    this.counter = `${prefix}${Math.floor(seconds / 60)}min:${textSec}sec`;
      if (seconds === 0) {
        clearInterval(timer);
        this.getLockInwardinstruction();
      }
    }, 1000);
  }

  getBikeInward() {
    this.subscription.push(this.BikeService.getBikeModelDetails(0,1,0).subscribe((res) => {
      if (res.statusCode === 200) {
        this.BikeModelDetails = res.data;
      } 
    }))
  }

  addLockInward() {
    this.lockInwardForm.value.lockInwardId = 0
    this.lockInwardForm.value.statusEnumId = 1,
    this.lockInwardForm.value.instructionId =1,
    this.lockInwardForm.value.remark = "not yet ",
    this.lockInwardForm.value.actionByLoginUserId =3,
    this.lockInwardForm.value.actionByUserTypeEnumId = 3
    this.subscription.push(this.LockService.addLockModelDetails(this.lockInwardForm.value).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message);
        this.lockInwardForm.reset(); 
        this.getLockInwardinstruction();
      } else {
        this.toastr.warning(res.message);
      }
    }))
  }

  updateLockInward(){
    this.subscription.push(this.LockService.addLockModelDetails(this.lockInwardForm.value).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message);
        this.lockInwardForm.reset(); 
        this.getLockInwardinstruction();
      } else {
        this.toastr.warning(res.message);
      }
    }))
  }

  getLockInwardinstruction() {
    this.subscription.push(this.LockService.getLockDetails(0,0).subscribe((res) => {
      if (res.statusCode === 200) {
        this.lockInwardData = res.data;
        this.lockInwardData.forEach((ele:any) => {
          if(ele.registrationStatus === true){
           ele.counter = "Registred";
          }else{
            console.log("this.counter",Math.round(ele.minutes))
            if(Math.round(ele.minutes) < 5){
              this.timer(5-ele.minutes);
              setInterval(() => {
                ele.counter = this.counter;
              }, 1000);
            }   
          }
        });
      } else{
        this.toastr.warning(res.message);
      }
    }))
  }

  // getLockInward() {
  //   this.subscription.push(this.LockService.getLockDetails(0,0).subscribe((res) => {
  //     if (res.statusCode === 200) {
  //       this.lockInwardData = res.data;
  //       this.getLockInwardinstruction();
  //     } else{
  //       this.toastr.warning(res.message)

  //     }
  //   }))
  // }

  changeStatus(data){
    let dialogRef = this.dialog.open(ChangeStatusComponent, {
      width: '500px',
      height:'500px',
      data: {
        data: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    
      if (result !== undefined) {
        this.getLockInwardinstruction();
      }
    });
  }

  getVehicleList() {
    this.subscription.push(this.VehicleModel.getVehicleList().subscribe((res) => {
      if(res.statusCode === 200){
        this.vehicleModel = res.data;
        if(res.message === "Data is not available."){
          this.vehicleModel.push({modelName:"Data is not available."})
        
        }
      
      }else{
        this.toastr.warning(res.message);
      }
    }))
  }

  onActionHandlerBIKE(event) {
    if (event.action === 'edit') {
      this.bikeinwardForm.controls['bikeInwardId'].setValue(Number(event.data.bikeInwardId));
      this.bikeinwardForm.controls['vehicleId'].setValue(event.data.vehicleId);
      this.bikeinwardForm.controls['inwardDate'].setValue(event.data.inwardDate);
      this.bikeinwardForm.controls['vehicleModelUId'].setValue(event.data.vehicleModelUId);  
  }
  }

  onActionHandlerLOCK(event) {
    if (event.action === 'edit') {
      this.lockInwardupdateButton = true;
      this.lockInwardAddButton = false
      this.lockInwardForm.controls['lockInwardId'].setValue(Number(event.data.lockInwardId));
      this.lockInwardForm.controls['lockNumber'].setValue(event.data.lockNumber);
      this.lockInwardForm.controls['inwardDate'].setValue(event.data.inwardDate);
      this.lockInwardForm.controls['lockIMEINumber'].setValue(event.data.lockIMEINumber);  
    }
  }

  backButton() {
    this.router.navigate(['./main/inward']);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}