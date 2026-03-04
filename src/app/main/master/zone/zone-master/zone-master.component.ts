import { addUpdateZone } from './../../../../core/models/zone/addZone';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ZoneService } from 'src/app/core/services/zone.service';
import { CommonService } from 'src/app/core/services/common.services';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { IGetCityData } from 'src/app/core/interfaces/common/city-data';
import { ALPHABETS_PATTERN, DESCRIPTION_FIELD_LIMIT, NAME_FIELD_MAX_LIMIT,
   NAME_FIELD_MIN_LIMIT, ADDRESS_FIELD_LIMIT, AREATYPE } from 'src/app/core/constants/common-constant';

import { IGetStateData } from 'src/app/core/interfaces/common/state-data';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AreaService } from 'src/app/core/services/master/area/area.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportService } from 'src/app/core/services/report/report.service';


@Component({
  selector: 'app-zone-master',
  templateUrl: './zone-master.component.html',
  styleUrls: ['./zone-master.component.scss'],
})
export class ZoneMasterComponent implements OnInit {
  userDetails = JSON.parse(sessionStorage.getItem('user'));
  areaDropdown = new Uiconfig();
  stateDropdown = new Uiconfig();
  cityDropdown = new Uiconfig();
  areaTypeDropdown = new Uiconfig()
  stateData: IGetStateData[] = []
  cityData: IGetCityData[] = []
  heading: string = 'Add New Zone';
  createZoneForm: FormGroup;
  subscription: Subscription[] = [];
  editData:any;

  zoneData:any
  editMode:boolean=false
  viewMode:boolean=false
  areaMapData:any=[]
  isChangeMap:boolean=false
  cityandStateChange:boolean
  constructor( public  activatedRoute: ActivatedRoute,private commonService: CommonService,
    private toastr: ToastrService,public formBuilder: FormBuilder, public router: Router,
     private zoneService: ZoneService,private spinner: NgxSpinnerService,private reportService:ReportService,
     private AreaService:AreaService, private cd: ChangeDetectorRef,) {}

  latlngReceive($event: string){
    let zonelatlng :any= $event;
    if(!this.viewMode){
      this.createZoneForm.patchValue({
        latitude:   zonelatlng.lat,
        longitude:  zonelatlng.lng,
      })
    }
    
    console.log( this.createZoneForm.value)
  }

  ngOnInit(): void {
    this.setFormControls();
    this.setDefaultConfig();
    this.getState(0); // For India
    this.getAreaTypeOpen_Close()
    // this.getAllAreaList(0,0)
    this.activatedRoute.queryParams.subscribe((params) => {
      if ((params.title === 'edit')|| (params.title === 'view')) {
       // alert(params.title)
       this.heading = "Edit Zone" 
       this.editMode=true
        this.editData =JSON.parse(params.data)
        this.createZoneForm.patchValue({
          zoneId:       this.editData.id,
          name:         this.editData.name,
          latitude:     Number(this.editData.latitude),
          longitude:    Number(this.editData.longitude),
          zoneSize:     this.editData.zoneSize,
          cityId:       this.editData.cityId,
          stateId:      this.editData.stateId,
          areaId:       Number(this.editData.areaId),
          areaTypeId:     Number(this.editData.areaTypeEnumId),
          statusEnumId: 1,
          remark:       "",
          zoneCapacity: this.editData.zoneCapacity,
          zoneAddress:  this.editData.zoneAddress,
          actionByLoginUserId:Number(this.userDetails.id),
          actionByUserTypeEnumId:Number(this.userDetails.user_type_enum_id)
        });
        this.editData.title=params.title
        // this.mode = params.title;
      
      this.getAreaDetailByAreaIdCityId(Number(this.editData.areaId),0,0)
      this.getAllAreaList(0,this.editData.cityId,0)
      this.getAllZoneByArea(Number(this.editData.areaId))

      }
      if(params.title === 'view'){
        this.heading = "View Zone"
        this.createZoneForm.disable();
       this.viewMode=true

      }
      
    });
  }

  getAreaDetailByAreaIdCityId(areaId,cityId,areaTypeId){

    this.spinner.show();
    this.subscription.push(this.AreaService.getAreaDetailByCityId(areaId,cityId,areaTypeId).subscribe(res=>{
      if (res.statusCode === 200) {
        this.areaMapData = res.data
        console.log(this.areaMapData,"areaData")
        this.spinner.hide()
        // this.toastr.success(res.message);
      }
      
      else{
        this.toastr.warning(res.message);
        this.spinner.hide()

      }
    }))
  }


  setFormControls() {
    this.createZoneForm = this.formBuilder.group({
      zoneId: [0],
      name: ['',[Validators.required, Validators.maxLength(NAME_FIELD_MAX_LIMIT)]],
      latitude:['',[Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      longitude:['',[Validators.required, Validators.maxLength(9),Validators.minLength(9)]],
      zoneSize:['',[Validators.required, Validators.maxLength(5),Validators.minLength(1)]],
      zoneCapacity:['',[Validators.required, Validators.maxLength(5),Validators.minLength(1)]],
      zoneAddress: ['',[Validators.required, Validators.maxLength(ADDRESS_FIELD_LIMIT)]],
      cityId: ['',[Validators.required]],
      stateId:['',[Validators.required]],
      areaTypeId:['',[Validators.required]],
      areaId:['',[Validators.required]],
      statusEnumId: [1],
      remark:[''],
      actionByLoginUserId:[Number(this.userDetails.id)],
      actionByUserTypeEnumId:[Number(this.userDetails.user_type_enum_id)]
    });
  }

  setDefaultConfig(){
    // State Dropdown
    this.stateDropdown.label = 'Select State'
    this.stateDropdown.key = 'mapStateId'//"state_id"
    this.stateDropdown.displayKey = 'mapStateName'//'state_name'

    // city Dropdown
    this.cityDropdown.label = 'Select City';
    this.cityDropdown.key = 'mapCityId'
    this.cityDropdown.displayKey = 'mapCityName'

     //AreaType
     this.areaTypeDropdown.label = 'Select Area Type';
     this.areaTypeDropdown.key = 'enum_id',//'id';
     this.areaTypeDropdown.displayKey ='name';

    //area
    this.areaDropdown.label ='Select Area';
    this.areaDropdown.key = 'areaId'
    this.areaDropdown.displayKey = 'name'

  }

  saveZone() {
    this.createZoneForm.value.zoneSize
    this.createZoneForm.value.zoneCapacity
    console.log(this.createZoneForm,"ddfd")
    if(this.createZoneForm.valid){
      if((this.createZoneForm.value.zoneSize  <= 99999) || (this.createZoneForm.value.zoneSize >= 1) ){
        if((this.createZoneForm.value.zoneCapacity  <= 99999) || (this.createZoneForm.value.zoneCapacity >= 1) ){
          const  addUpdateZoneModel =  {...this.createZoneForm.value}
          addUpdateZoneModel.latitude =  String(this.createZoneForm.value.latitude)
          addUpdateZoneModel.longitude =  String(this.createZoneForm.value.longitude)
          addUpdateZoneModel.zoneSize = Number(this.createZoneForm.value.zoneSize);
          addUpdateZoneModel.zoneCapacity = Number(this.createZoneForm.value.zoneCapacity);
          // appUpdateZoneModel.areaId= this.createZoneForm.value.areaId
          // if (this.editMode === 'edit'){
          //   addUpdateZoneModel.latitude
          // }
          console.log( addUpdateZoneModel," addUpdateZoneModel")
          // return
          this.subscription.push(this.zoneService.addUpdateZone(addUpdateZoneModel).subscribe((res) => {
            if (res.statusCode === 200) {
              this.toastr.success(res.message);
              this.createZoneForm.reset();
              this.router.navigate(['./main/master/zone']);
            } else if (res.statusCode === 422) {
              this.toastr.warning(res.message)
            }
            else {
              this.toastr.warning(res.message);
            }
          }))
        }
      }
      else{
        this.toastr.warning('Minimum sq ft  should be 1 and maximum be 99999');
      }
    }else{
      this.createZoneForm.markAllAsTouched()
      // this.toastr.warning('INVALID Data');
      return
    }
  }
  receivename($event: string) {
    let zoneAddress :any= $event;
    this.createZoneForm.patchValue({
      zoneAddress: zoneAddress.address
     })

    const state_id =  this.stateData.find(element => {
     for (let i = 0; i <zoneAddress.stateCity.length; i++) {
       if(element.state_name === zoneAddress.stateCity[i].long_name){
        return  element.state_id;
      }
     }
    });

    this.createZoneForm.patchValue({ stateId:state_id.state_id});

    this.commonService.getCityList( Number(this.createZoneForm.value.stateId)).subscribe((res) => {
      if (res.statusCode === 200) {
        this.cityData = res.data;

       const city_id =   this.cityData.find(element => {
          for (let i = 0; i <zoneAddress.stateCity.length; i++) {

            if(element.city_name === zoneAddress.stateCity[i].long_name){
              return  element.city_id ;
            }
          }
        });

        this.createZoneForm.patchValue({ cityId:city_id.city_id})

      }
    })

  }
  getState(id) {
   this.subscription.push(this.zoneService.getMapState(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.stateData = res.data;
        if (this.editData) {
          // this.createZoneForm.controls.stateId.setValue(Number(this.createZoneForm.value.stateId));
           this.getCity();
        }
      } else {
        this.toastr.warning(res.message)
      }
    }))
  }

  getCity() {
    this.cityData =[]
    this.areaData=[]
    // this.isChangeMap=true
    const stateId = this.createZoneForm.value.stateId;
   
    this.subscription.push(this.zoneService.getMapCity(stateId).subscribe((res) => {
      if (res.statusCode === 200) {
        this.cityData = res.data;

        if (this.editData) {

            this.createZoneForm.controls.cityId.setValue((this.createZoneForm.value.cityId));
        }
      } else {
        this.toastr.warning(res.message);
      }
    }))

  }

  getCitys(){
    this.createZoneForm.controls.stateId.valueChanges.subscribe(data =>{
      // this.isChangeMap=true
      this.cityandStateChange=true
      this.cd.detectChanges();
      console.log(data, this.cityandStateChange)
      
    }
   )

   this.getCity()
  }


  backButton() {
    this.router.navigate(['./main/master/zone']);
  }

  cancleZone(){
    this.router.navigate(['./main/master/zone']);
  }

areaData:any=[]

getAreabyCity(event){
  console.log(event)
  // this.getAreaTypeOpen_Close()
let cityId
  this.getAllAreaList(0,event,0)
  this.createZoneForm.controls.cityId.valueChanges.subscribe(data =>{
    console.log(data)
    this.isChangeMap=false
    this.cityandStateChange=true

  })
  // this.getAreaDetailByAreaIdCityId(event,0)
}

getAreaCityForMap(event){
  this.getAreaDetailByAreaIdCityId(event,0,0)
  this.createZoneForm.controls.areaId.valueChanges.subscribe(data =>{
    console.log(data)
    this.isChangeMap=true
    this.cityandStateChange=false

  })
  this.getAllZoneByArea(event)
}

//getAllZoneBy AreaId
allZoneData:any=[]
getAllZoneByArea(event){
  this.subscription.push(this.zoneService.getZoneList(0,event).subscribe((res) => {
    if(res.statusCode === 200){
      this.allZoneData = res.data;
      console.log(this.allZoneData,"check")
    }
    else{
      this.toastr.warning(res.message)
    }
  }))
}



  getAllAreaList(areaId,cityId,areaTypeId){

    this.areaData=[]
    // this.spinner.show();
    this.subscription.push(this.zoneService.getAreaDetailOnMapZone(areaId, cityId, areaTypeId).subscribe(res=>{
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

  

  checkMode() {
    if (this.zoneData !== null) {
      if (this.zoneData.mode === 'edit') {
        this.editMode = true;
        this.heading = 'Edit Area :  ' + this.zoneData.name;
        
      } else {
        this.viewMode = true;
        this.heading = 'View Area : ' + this.zoneData.name;
      }
      this.setFormValue();
    }
  }
  setFormValue() {
    console.log(
      this.zoneData,
      'ststusEnumId',
      'this.bodyColorData.statusEnunId'
    );
    this.createZoneForm.patchValue({
      name: this.zoneData.name,
      stateId: String(this.zoneData.stateId),
      cityId: Number(this.zoneData.cityId),
      areaId: this.zoneData.areaTypeEnumId,
    });

    if (this.viewMode) {
      this.createZoneForm.disable();
    }
  }

  areaTypeData:any=[]
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
    console.log(e)
let cityId = this.createZoneForm.controls.cityId.value | 0
    this.getAllAreaList(0,cityId,e)
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('zoneData');
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }
}
