import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { AREATYPE, DATE_TIME_FORMAT, EDIT, ShiftZone, VIEW } from 'src/app/core/constants/common-constant';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { VehicleModelService} from '../../../core/services/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { ZoneService } from 'src/app/core/services/zone.service';
import { BikeModelService} from 'src/app/core/services/BikeInward/bikeInward.service';
import { ZoneWiseListService } from 'src/app/core/services/allotment/allotment.service';
import  { ProduceBikeService } from 'src/app/core/services/produceBike/produceBike.service';
import { ReportService } from 'src/app/core/services/report/report.service';
import { AreaService } from 'src/app/core/services/master/area/area.service';

@Component({
  selector: 'app-allotment-list',
  templateUrl: './allotment-list.component.html',
  styleUrls: ['./allotment-list.component.scss'],
})
export class AllotmentListComponent implements OnInit {
  addBtn ="Add"
  
  cols = [];
  cols2 = [];
  addBikeAllotmentForm : FormGroup; 
  subscription: Subscription[] = [];
  is_edit_checked: boolean;
  is_view_checked: boolean;
  allotmentForm: FormGroup;

  modal = new Uiconfig();
  ID = new Uiconfig();
  zone = new Uiconfig();
  selectModel = new Uiconfig();

  vehicleModel = [];
  selectZone = [];
  getZoneWiseListData = [];
  bikeallotedzonelist = [];
  ZoneWiseListByBiKe = [];
  uidModel = [];

  areaDropdown = new Uiconfig();
  stateDropdown = new Uiconfig();
  cityDropdown = new Uiconfig();
  areaTypeDropdown = new Uiconfig();
  stateData: any = []
  cityData: any = []
  user = JSON.parse(sessionStorage.getItem('user'));


  constructor( private zoneService: ZoneService,private toastr: ToastrService,
    public Vehicle :VehicleModelService,public ZoneWiseListService : ZoneWiseListService, 
    public formBuilder: FormBuilder, public router: Router , private AreaService:AreaService,
    private spinner: NgxSpinnerService, private reportService:ReportService,
    public BikeModel : BikeModelService,private vehicleService:VehicleModelService,
    public ProduceBikeService :ProduceBikeService) {}
  
  ngOnInit(): void {
    this.setFormControls()
    this.setDefaultConfig()
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
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'modelName',
        display: 'Model',
        sort: true,
      },
      {
        key: 'uId',
        display: 'UID',
        sort: true,
      },
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: {trueFalseAction: true},
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
        config: { isDate: true, format: 'dd-MM-yyyy' }
      },
      {
        key: 'modelName',
        display: 'Model',
        sort: true,
      },
      // lockNumber
      {
        key: 'lockNumber',
        display: 'IOT Device ID',
        sort: true,
      },
      {
        key: 'uId',
        display: 'Vehicle UID',
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
        key: 'areaTypeName',
        display: 'Area Type',
        sort: true,
      },
      {
        key: 'areaName',
        display: 'Area Name',
        sort: true,
      },

      {
        key: 'zoneName',
        display: 'zone Name',
        sort: true,
      },
      {
        key: 'zoneAddress',
        display: 'zone Address',
        sort: true,
      },
      {
        key: 'statusName',
        display: 'Status',
        sort: true,
      },
      // {
      //   key: 'shiftZone',
      //   display: '',
      //   sort: false,
      //   config: {
      //     actions: [
      //       ShiftZone
      //     ],
      //     isbutton: true,
      //     isClickAble: true,
      //   }
      // },
      
      // {
      //   key: 'toggleStatus',
      //   display: 'Action',
      //   sort: false,
      //   config: {trueFalseAction: true},
      // },
      
    ];
    // this.getZoneList();
    // this.zoneIdType(0);
   this.getVehicleList();
  //  this.getBikeProduceDetails();
    this.setFormControls();
    this.setDefaultConfig();
    this.getAllotmentDetails();
    // this.getZoneWiseListByBiKe();
    this.getState(0)
  }
  
  setFormControls() {
    
    this.addBikeAllotmentForm = this.formBuilder.group({   
      bikeAllotmentId: 0,
      vehicleId: [''],
      uId: [''],
      zoneId: [''],
      statusEnumId: 1,
      remark: "remark",
      actionByLoginUserId:this.user.id,//[''],
      actionByUserTypeEnumId:this.user.user_type_enum_id, //[''],
      cityId: ['',[Validators.required]],
      stateId:['',[Validators.required]],
      areaTypeId:['',[]],
      areaId:['',[Validators.required]],
    });

   
  }
  
  setDefaultConfig(){
    // modal
    this.modal.label = 'Select Model';
    this.modal.displayKey = 'modelName';
    this.modal.key = 'vehicleId';
    this.modal.multiple = false;
    //uid
    this.ID.label = 'Select UID, vehicle, model, IOT Device Name';
    this.ID.displayKey = 'displayName',//'vehicleModelUId';
    this.ID.key = 'uid';
    this.ID.multiple = false;
    //zone id
    this.zone.label = 'Select Zone';
    this.zone.displayKey = 'name';
    this.zone.key = 'id';
    this.zone.multiple = false;
    //selectModel
    
    this.selectModel.label = 'Select Zone';
    this.selectModel.displayKey = 'name';
    this.selectModel.key = 'id';
    this.selectModel.multiple = false;

    // State Dropdown
    this.stateDropdown.label = 'Select State'
    this.stateDropdown.key = 'mapStateId'//"state_id"
    this.stateDropdown.displayKey = 'mapStateName'//'state_name'

    // city Dropdown
    this.cityDropdown.label = 'Select City';
    this.cityDropdown.key = 'mapCityId'
    this.cityDropdown.displayKey = 'mapCityName'

    //AreaTypw
    this.areaTypeDropdown.label = 'Select Area Type';
    this.areaTypeDropdown.key = 'enum_id',//'id';
    this.areaTypeDropdown.displayKey ='name';

    //area
    this.areaDropdown.label ='Select Area';
    this.areaDropdown.key = 'areaId'
    this.areaDropdown.displayKey = 'name'

  }

  getVehicleList() {
    this.subscription.push(this.Vehicle.getVehicleList().subscribe((res) => {
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

  getBikeProduceDetails(){
    this.subscription.push(this.ProduceBikeService.getBikeProduceDetails().subscribe((res) => {
      if (res.statusCode === 200) {
        this.vehicleModel = res.data;
        console.log("  this.vehicleModel",  this.vehicleModel)
        //this.vehicleModel.push( res.data.find(e => e.allotmentStatusName === 'UnAllocated')) 
        if(res.message === "Data is not available."){
          this.vehicleModel.push({modelName:"Data is not available."})
        
        }
      } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
      }
      else {
        this.toastr.warning(res.message);
      }
    }))
  }
  vehicleIdType(id){
    this.getUidListByVehicleId(id)
  }

  getUidListByVehicleId(vehicleId){
    this.subscription.push(this.ZoneWiseListService.getUidListByVehicleIdWithDetail(vehicleId,5,6).subscribe((res) => {
      if(res.statusCode === 200){
        this.uidModel = res.data;
        console.log(res.data,"ui")
        if(res.message === "Data is not available."){
          this.uidModel.push({displayName:"Data is not available."})
          console.log( this.uidModel )
        }
      }else{
        this.toastr.warning(res.message);
      }
    }))
  }

  getZoneList(e) { 
    this.subscription.push(this.zoneService.getZoneList(0,e).subscribe((res) => {
      if(res.statusCode === 200){
        this.selectZone =res.data;
        console.log(  this.selectZone)
        // if(res.message === "Data is not available."){
        //   this.selectZone.push({name:"Data is not available."})
        
        // }
      }else{
        this.toastr.warning(res.message)
      }
    }))
  }

  activeInactiveBikeAllotment(allotmentdata){
  
    this.subscription.push(this.ZoneWiseListService.activeInactiveBikeAllotment(allotmentdata).subscribe((res) => {
      if (res.statusCode === 200) {
       
         this.getAllotmentDetails()
      } 
    }))
  }

  getAllotmentDetails(){ 

    this.spinner.show();
    this.subscription.push(this.ZoneWiseListService.getAllotmentDetails().subscribe((res) => {
      if (res.statusCode === 200) {
        res.data.forEach((element) => {
          element.locationData = true;
        });
          this.bikeallotedzonelist = res.data;
          
          this.spinner.hide();
         
          this.bikeallotedzonelist.forEach((ele , index)=> {
            if(ele.statusEnumId === '1'){
              this.bikeallotedzonelist[index].toggleStatus = true;
            }else{
              this.bikeallotedzonelist[index].toggleStatus = false;
            }           
          });  
      } 
    }))
  }

  addBikeAllotment(){
    this.subscription.push(this.ZoneWiseListService.addUpdateBikeAllotment(this.addBikeAllotmentForm.value).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastr.success(res.message);
        this.getAllotmentDetails()
        this.getBikeProduceDetails()
        this.addBikeAllotmentForm.reset();
      } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
      }
      else {
        this.toastr.warning(res.message);
      }
    }))
  }

  getZoneWiseListByBiKe(){
    this.subscription.push(this.ZoneWiseListService.getZoneWiseListByBiKeAllotment(0).subscribe((res) => {
      if (res.statusCode === 200) {
        this.ZoneWiseListByBiKe = res.data;
      } 
    }))
  }

  zoneIdType(zoneid){
    this.subscription.push(this.ZoneWiseListService.getZoneWiseList(zoneid).subscribe((res) => {
      if (res.statusCode === 200) {
        this.getZoneWiseListData = res.data;
      } 
    }))
  }

  onActionHandler(event) {
    if (event.action === ShiftZone) {
      this.vehicleIdType(event.data.vehicleId)
      this.addBikeAllotmentForm.controls['bikeAllotmentId'].setValue(event.data.bikeAllotmentId);
      this.addBikeAllotmentForm.controls['vehicleId'].setValue(event.data.vehicleId);
      this.addBikeAllotmentForm.controls['uId'].setValue(event.data.uId);
      this.addBikeAllotmentForm.controls['zoneId'].setValue(event.data.zoneId); 
      this.addBtn = 'Change Zone' 
  }

   if(event.data.bikeAllotmentId){
    if(Number( event.data.statusEnumId) === 1 ){
      const bikeAllotment = {
        "statusEnumId":2,
        "bikeAllotmentId":  Number(event.data.bikeAllotmentId)
      }
      this.activeInactiveBikeAllotment(bikeAllotment)
    }else{
      const bikeAllotment = {
        "statusEnumId":1,
        "bikeAllotmentId": Number( event.data.bikeAllotmentId)
      }
      this.activeInactiveBikeAllotment(bikeAllotment)
    }
  }
}

getzoneData(event){

}

getState(id) {
  this.subscription.push(this.zoneService.getMapState(id).subscribe((res) => {
     if (res.statusCode === 200) {
       this.stateData = res.data;
    
     } else {
       this.toastr.warning(res.message)
     }
   }))
 }
areaData:any=[]
 getCitys() {
   this.cityData =[]
   this.areaData=[]
   // this.isChangeMap=true
   const stateId = this.addBikeAllotmentForm.value.stateId;
  
   this.subscription.push(this.zoneService.getMapCity(stateId).subscribe((res) => {
     if (res.statusCode === 200) {
       this.cityData = res.data;
       
     } else {
       this.toastr.warning(res.message);
     }
   }))

 }

 getAreabyCity(event){
  console.log(event)
let cityId
  this.getAreaTypeOpen_Close()

  this.getAllAreaList(0,event,0)
 }

 getAllAreaList(areaId,cityId,areaTypeId){

  this.areaData=[]
  // this.spinner.show();
  this.subscription.push(
    this.zoneService.getAreaDetailOnMapZone(areaId, cityId, areaTypeId).subscribe(res=>{
    if (res.statusCode === 200) {
      this.areaData = res.data
      console.log(this.areaData,"areaData")
      // this.spinner.hide()
      // this.toastr.success(res.message);
    }else if(res.statusCode ==422){
      this.toastr.warning("Area not created for selected city")
    }
    else{
      this.toastr.warning(res.message);
      // this.spinner.hide()

    }
  }))


  
}

areaTypeData:any =[]
getAreaTypeOpen_Close(){
  this.areaTypeData = []
  this.subscription.push(
    this.reportService.GetEnumDetails(AREATYPE).subscribe((res) => {
      if (res.statusCode === 200) {
        this.spinner.hide();
        this.areaTypeData = res.data;
      } else {
        this.spinner.hide();
        // this.toastr.warning(res.message)
      }
    })
  );
}

selectAreaType(e){
  console.log(e, this.areaData)
  let cityId = this.addBikeAllotmentForm.controls.cityId.value | 0
    this.getAllAreaList(0,cityId,e)

}

}
