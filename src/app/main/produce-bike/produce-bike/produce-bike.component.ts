import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component';
import { ActiveOrDeactiveButton, EDIT, QR, VIEW } from 'src/app/core/constants/common-constant';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LockService } from 'src/app/core/services/lockInward/lockInward.service';
import { VehicleModelService} from '../../../core/services/vehicle.service';
import { ZoneService } from 'src/app/core/services/zone.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ZoneWiseListService } from 'src/app/core/services/allotment/allotment.service';
import  { ProduceBikeService } from 'src/app/core/services/produceBike/produceBike.service';
import { Router } from '@angular/router';
import { BikeModelService } from 'src/app/core/services/BikeInward/bikeInward.service';
import { QrModelComponent } from '../qr-model/qr-model.component';
@Component({
  selector: 'app-produce-bike',
  templateUrl: './produce-bike.component.html',
  styleUrls: ['./produce-bike.component.scss'],
})
export class ProduceBikeComponent implements OnInit {
  subscription: Subscription[] = [];
  lockSelectDropdown = [];
  cols = [];
  is_edit_checked: boolean;
  is_view_checked: boolean;
  ProduceForm: FormGroup;

  vehicleModel = [];
  BikeProduceDetailsList = [];
  uidModel = [];
  selectm = new Uiconfig();
  UID = new Uiconfig();
  lock = new Uiconfig();
  user = JSON.parse(sessionStorage.getItem('user'));

  constructor(public formBuilder : FormBuilder ,
    private BikeService: BikeModelService,
              private dailogRef  : MatDialog , 
              private LockService: LockService ,
              private zoneService: ZoneService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              public Vehicle :VehicleModelService,
              public ZoneWiseListService : ZoneWiseListService, 
              public router: Router , 
              public ProduceBikeService :ProduceBikeService ,
            ) {}

  ngOnInit(): void {

  
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'modelName',
        display: 'Vehicle Model',
        sort: true,
      },
      {
        key: 'vehicleModelUId',
        display: 'Vehicle UID',
        sort: true,
      },
      {
        key: 'lockNumber',
        display: 'IOT Device ID',
        sort: true,
      },
      {
        key: 'qrNumber',
        display: 'Qr Number',
        sort: true,
      },
      {
        key: 'mapStateName',
        display: 'State Name',
        sort: true,
      },
      {
        key: 'mapCityName',
        display: 'City Name',
        sort: true,
      },
      {
        key: 'areaName',
        display: 'Area Name',
        sort: true,
      },
      {
        key: 'zoneName',
        display: 'Zone Name',
        sort: true,
      },
      
      {
        key: 'lockIMEINumber',
        display: 'lock IMEI Number',
        sort: true,
      },
      {
        key: 'allotmentStatusName',
        display: 'Alloted Status',
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
        key: 'qr',
        display: 'QR',
        sort: false,
          config: {
          isImage: true,
          isClickAble:true,
          actions: [QR]
        }
      },
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isPdf: true ,isClickAble:true},
      },
      {
        key: 'actionEdit',
        display: '',
        sort: false,
        config: { isAction: true, actions: [EDIT] },
      },
      {
        key: 'bikeProduceIds',
        display: '',
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

    this.getLockLists();
    this.getVehicleList();
    // this.getBikeInward();
    this.getBikeProduceDetails();
    this.setDefaultConfig();
    this.setFormControls();
   
  }

  setFormControls() {
    this.ProduceForm = this.formBuilder.group({
        bikeProduceId: 0,
        vehicleId: ['',[Validators.required]],
        uId: ['',[Validators.required]],
        lockId: ['',[Validators.required]],
        statusEnumId: 1,
        qrNumber:['',[Validators.required]],
        remark: [''],
        // actionByLoginUserId: 3,
        // actionByUserTypeEnumId: 3
        actionByLoginUserId:this.user.id,//[''],
      actionByUserTypeEnumId:this.user.user_type_enum_id, //[''],
    });
  }

  setDefaultConfig() {
 
    // modal
    this.selectm.label = 'Select Vehicle Model';
    this.selectm.displayKey = 'modelName';
    this.selectm.key = 'vehicleId';
    this.selectm.multiple = false;
    //uid
    this.UID.label = 'Select Vehicle UID';
    this.UID.displayKey = 'vehicleModelUId';
    this.UID.key = 'uid';
    this.UID.multiple = false;
    //lock
    this.lock.label = 'Select IOT Device ID';
    this.lock.displayKey = 'lockNumber';
    this.lock.key = 'lockId';
    this.lock.multiple = false;
  }

  
  getBikeInward() {
    this.spinner.show();
    this.subscription.push(this.BikeService.getBikeModelDetails(0,1,6).subscribe((res) => {
      if (res.statusCode === 200) {
      
        this.vehicleModel = res.data;
        console.log("getBikeModelDetails", this.vehicleModel)
        if(res.message === "Data is not available."){
          this.vehicleModel.push({modelName:"Data is not available."})
        }
        console.log(this.vehicleModel)
        this.spinner.hide();
      } 
    }))
  }
  getVehicleList() {
    this.subscription.push(this.Vehicle.getVehicleList().subscribe((res) => {
      if(res.statusCode === 200){
        this.vehicleModel = res.data;
      
      }else{
        this.toastr.warning(res.message);
      }
    }))
  }

  vehicleIdType(id){
    this.getUidListByVehicleId(id)
  }

  getUidListByVehicleId(vehicleId){
    this.subscription.push(this.ZoneWiseListService.getUidListByVehicleId(vehicleId,6,6).subscribe((res) => {
      if(res.statusCode === 200){
        this.uidModel = res.data;
        if(res.message === "Data is not available."){
          this.uidModel.push({vehicleModelUId:"Data is not available."})
          console.log( this.uidModel )
        }
      }else{
        this.toastr.warning(res.message);
      }
    }))
  }

  getLockLists(){
    this.subscription.push(this.LockService.getLockLists().subscribe((res) => {
      if (res.statusCode === 200) {
        this.lockSelectDropdown = res.data;
        if(res.message === "Data is not available."){
          this.lockSelectDropdown.push({lockNumber:"Data is not available."})
        
        }
      } 
    }))
  }

  addUpdateBikeProduce(){
   if(this.ProduceForm.invalid){
     this.ProduceForm.markAllAsTouched();
     return
   }
   
    this.subscription.push(this.ProduceBikeService.addUpdateBikeProduce(this.ProduceForm.value).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message);
        this.ProduceForm.reset();
        this.getBikeProduceDetails();
        this.getBikeInward();
        this.getLockLists();
      } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
      }
      else {
        this.toastr.warning(res.message);
      }
    }))
  }

  getBikeProduceDetails(){
    this.subscription.push(this.ProduceBikeService.getBikeProduceDetails().subscribe((res) => {
      if (res.statusCode === 200) {
        res.data.forEach(e=>{
          if(e.mapStateName == null ) e.mapStateName = "NA"
          if( e.mapCityName == null ) e.mapCityName = "NA"
          if( e.areaName == null) e.areaName = "NA"
          if( e.zoneName == null) e.zoneName = "NA"
          // e.locationData=true
          e.isActiveOrDeactive =true
        })
        this.BikeProduceDetailsList = res.data;
      } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
      }
      else {
        this.toastr.warning(res.message);
      }
    }))
  }

  // rowclick(event){
  //   console.log(event)
  //   this.dailogRef.open(PopUpComponent,{data:{pageValue:event.qr}})
  // }


  onActionHandler(event){
     if(event.action === ActiveOrDeactiveButton ){
      // this.onActionHandler(event)
      console.log(event) 
      // if(event.data.lockInwardId){
        if(Number( event.data.statusEnumId) === 1 ){
          const bikeAllotment = {
            "statusEnumId":2,
            "bikeId": Number( event.data.id)
          }
          this.changeBikeStatus(bikeAllotment)
        }else{
          const bikeAllotment = {
            "statusEnumId":1,
            "bikeId":  Number( event.data.id)
          }
          this.changeBikeStatus(bikeAllotment)
        }
      // }
    }
    else if(event.action == EDIT){
      console.log(event, "event")
      this.openQrEditModel(event.data)
    }

  }


  openQrEditModel(e){
      const dialogRef = this.dailogRef.open(QrModelComponent, {
        data: e,
        height: '800px',
        width: '700px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // console.log(result);
          // // dialogRef.close({ refreshing: true })
          this.getBikeProduceDetails();
        }
      });
    
  }

  changeBikeStatus(data){
    this.spinner.show()
    this.subscription.push(this.ProduceBikeService.changeBikeStatusActiveDeactive(data).subscribe((res) => {
      if (res.statusCode === 200) {
        // this.getLockInwardinstruction()
        this.toastr.success(res.message)
        this.getBikeProduceDetails()
    this.spinner.hide()

      //  this.getLockInward();
      } 
      this.spinner.hide()
    }))
  }
}
