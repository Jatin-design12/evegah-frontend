import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActiveOrDeactiveButton, ClientMetro, DATE_FORMAT, DATE_TIME_FORMAT, DELETE, DeviceRegister, EDIT, toggle } from 'src/app/core/constants/common-constant';
import { ILockListData } from 'src/app/core/interfaces/lockInward/list-data';
import { LockInward } from 'src/app/core/models/inward/lock-inward-model';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { BikeModelService } from 'src/app/core/services/BikeInward/bikeInward.service';
import { VehicleModelService } from 'src/app/core/services/vehicle.service';
import { ChangeStatusComponent } from '../change-status/change-status.component';
import { LockService } from 'src/app/core/services/lockInward/lockInward.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/shared/components/components';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss']
})
export class LockComponent implements OnInit , OnDestroy{
  heading: string = 'Inward IOT Device';
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
  today:any = new Date()
  user = JSON.parse(sessionStorage.getItem('user'));
  constructor(public formBuilder: FormBuilder, public router: Router,
    private BikeService: BikeModelService,
    private LockService: LockService ,public dialog: MatDialog,
    private toastr: ToastrService,private spinner: NgxSpinnerService,
    private  VehicleModel: VehicleModelService) { }

    isClientMetro=false

  ngOnInit(): void {

    
    
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
        config: { isDate: true, format:DATE_FORMAT},
      },
      {
        key: 'lockNumber',
        display: 'IOT Device ',
        sort: true,
      },
      {
        key: 'lockIMEINumber',
        display: 'IOT Device  IMEI Number',
        sort: true,
      },
      {
        key:'registrationStatus',
        display:'registration Status',
        sort: true,
      },
      {
        key:'statusName',
        display:'IOT Device  Status',
        sort: true,
      },
      {
        key:'counter',
        display:'Timer',
        sort: true,
        
      },
      {
        key: 'createdOnDate',
        display: 'Create Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'updatedOnDate',
        display: 'Update Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'action',
        display: '',
        sort: false,
        config: { isAction: true, actions: [EDIT, DELETE] },
      },
      // {
      //   key: 'toggleStatus',
      //   display: 'Action',
      //   sort: false,
      //   config: { trueFalseAction: true , actions: [toggle]},
      // }
      {
        key: 'bikeProduceIdsk',
        display: 'Action',
        sort: false,
        config: {
          actions: [
            ActiveOrDeactiveButton
          ],
          isbutton: true,
          isClickAble: true,
        },
      },
    ];

    let clientName= environment.clientName// ClientMetro//this.commonService.checkClientName()
      if(clientName == ClientMetro){
        this.isClientMetro =true

        let index =  this.cols2.findIndex((e:any)=>  e.key == 'action')
        console.log(index)
        this.cols2.splice(index,1)
      }
   
   
    this.setFormControls();
    this.setDefaultConfig();
   // this.getLockInward();  
   this.getLockInwardinstruction()
  }

  setFormControls() {
   
    this.lockInwardForm  = this.formBuilder.group({
      lockInwardId: [0],
      lockNumber: [,[Validators.required] ],
      lockIMEINumber: [,[Validators.required]],
      inwardDate: [,[Validators.required]],
      statusEnumId: [1],
      instructionId:[1],
      remark: "not yet ",
      actionByLoginUserId:this.user.id,//[''],
      actionByUserTypeEnumId:this.user.user_type_enum_id, //[''],
    });


  }

  setDefaultConfig(){

     // modal
     this.modal.label = 'Select Model';
     this.modal.displayKey = 'modelName';
     this.modal.key = 'vehicleId';
     this.modal.multiple = false;
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

  

  addLockInward() {

    this.lockInwardForm.value.lockInwardId = 0
    this.lockInwardForm.value.statusEnumId = 1,
    this.lockInwardForm.value.instructionId =1,
    this.lockInwardForm.value.remark = "not yet ",
    this.lockInwardForm.value.actionByLoginUserId =this.user.id,
    this.lockInwardForm.value.actionByUserTypeEnumId = this.user.user_type_enum_id
    this.lockInwardForm.value.lockId = 0

    this.subscription.push(this.LockService.addLockModelDetails(this.lockInwardForm.value).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message);
        this.lockInwardForm.reset(); 
        // this.Buttonlabel="Add"
        this.getLockInwardinstruction();
      } else {
        this.toastr.warning(res.message);
      }
    }))
  }

  updateLockInward(){
    
    this.lockInwardForm.value.lockInwardId = this.editData.lockInwardId
    this.lockInwardForm.value.statusEnumId = 1,
    this.lockInwardForm.value.instructionId =1,
    this.lockInwardForm.value.remark = "not yet ",
    this.lockInwardForm.value.actionByLoginUserId =this.user.id,
    this.lockInwardForm.value.actionByUserTypeEnumId = this.user.user_type_enum_id
    this.lockInwardForm.value.lockId = this.editData.lockId
    this.lockInwardForm.value.lockIMEIId =this.editData.lockIMEIId
    console.log(this.lockInwardForm.value,"kdkdk", this.editData)

    // return
  
    this.subscription.push(this.LockService.addLockModelDetails(this.lockInwardForm.value).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message);
        this.lockInwardForm.reset(); 
        this.lockInwardupdateButton=false
        this.lockInwardAddButton =true
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
        // res.data.forEach((ele , index)=> {
        //   if(ele.statusEnumId === '1'){
        //     this.lockInwardData[index].toggleStatus = true;
        //   }else{
        //     this.lockInwardData[index].toggleStatus = false;
        //   }           
        // });
        this.lockInwardData.forEach((ele:any,index) => {
          // ele.locationData = true;
          ele.isActiveOrDeactive =true

          if(ele.registrationStatus === true){
           ele.counter = "Registred";
          }else{
            console.log("this.counter",Math.round(ele.minutes))
            if(Math.round(ele.minutes) < 5){  // table Timer 
              this.timer(5-ele.minutes);
              setInterval(() => {
                ele.counter = this.counter;
              }, 1000);
            }   
          }

          // status
          if(ele.statusEnumId === '1'){
            this.lockInwardData[index].toggleStatus = true;
          }else{
            this.lockInwardData[index].toggleStatus = false;
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
  //       res.data.forEach((ele , index)=> {
  //         if(ele.statusEnumId === '1'){
  //           this.lockInwardData[index].toggleStatus = true;
  //         }else{
  //           this.lockInwardData[index].toggleStatus = false;
  //         }           
  //       });
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


editData:any
  onActionHandlerLOCK(event) {
    console.log(event,"chkke")
   
    // if(event.data.counter== "Registred"){
    //   this.toastr.warning(DeviceRegister)
    //   return
    // }
    
    if (event.action === 'edit') {
      if(event.data.counter== "Registred"){
        this.toastr.warning(DeviceRegister)
        return
      }
      this.editData = event.data
      this.lockInwardupdateButton = true;
      this.lockInwardAddButton = false
      this.lockInwardForm.controls['lockInwardId'].setValue(Number(event.data.lockInwardId));
      this.lockInwardForm.controls['lockNumber'].setValue(event.data.lockNumber);
      this.lockInwardForm.controls['inwardDate'].setValue(event.data.inwardDate);
      this.lockInwardForm.controls['lockIMEINumber'].setValue(event.data.lockIMEINumber);  
    }
    else if(event.action === 'toggle'){
      this.onActionHandler(event)
    }
    else if(event.action ===ActiveOrDeactiveButton ){
      this.onActionHandler(event)
    }
    else if(event.action ===DELETE ){
     console.log("delte")
     if(event.data.counter== "Registred"){
      this.toastr.warning(DeviceRegister)
      return
    }
     let dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '300px',
      height:'300px',
      // data: {
      //   data: event
      // }
      data: {
        data: `Are you sure want Delete this  ${event.data.lockNumber} ?`,
        action: event.action,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
    
      // if (result !== undefined) {
      //   this.getLockInwardinstruction();
      // }
      if(result){
        this.deleteLockInward(event.data.lockId)

      }
    });
    }

  }
  onActionHandler(event){
  
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


  deleteLockInward(lockId){
    this.spinner.show()
   let obj={
      lockId:lockId
    }
    this.subscription.push(this.LockService.deleteLockInward(obj).subscribe((res) => {
      if (res.statusCode === 200) {
        this.spinner.hide()
        this.getLockInwardinstruction();
        this.toastr.success(res.message);
      } else{
        this.spinner.hide()
        this.toastr.warning(res.message);
      }
    }))
  }

  changeLockStatus(data){
    this.spinner.show()
    this.subscription.push(this.LockService.changeLockStatus(data).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getLockInwardinstruction()
    this.spinner.hide()

      //  this.getLockInward();
      } 
      this.spinner.hide()
    }))
  }


  backButton() {
    this.router.navigate(['./main']);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}