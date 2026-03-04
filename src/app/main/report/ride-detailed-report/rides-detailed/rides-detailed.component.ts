import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AREATYPE } from 'src/app/core/constants/common-constant';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model'
import { ReportService } from 'src/app/core/services/report/report.service';

@Component({
  selector: 'app-rides-detailed',
  templateUrl: './rides-detailed.component.html',
  styleUrls: ['./rides-detailed.component.scss']
})
export class RidesDetailedComponent implements OnInit {
  detailedRideFilterForm: FormGroup; 
  heading: string ; 
  rideStatusDropdown = new Uiconfig();
  detailedRideList = [];
  cols = [];
  enumData:any =[]
  subsciption: Subscription[] = [];
  tableData: any = [];
  areaDropdown = new Uiconfig();
  stateDropdown = new Uiconfig();
  cityDropdown = new Uiconfig();
  areaTypeDropdown = new Uiconfig();
  zoneDropdown =  new  Uiconfig()
  zoneDropdownEnd =  new  Uiconfig()
  areaDropdownEnd = new Uiconfig();

  stateData: any = []
  cityData: any = []
areaTypeData:any =[]
areaList:any = []
zoneData:any = []
  constructor(public formBuilder: FormBuilder,
    private reportService: ReportService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    ) { }

    today= new Date()
    sevenDaysBack :Date
    ngOnInit(): void {
      this.sevenDaysBack =  new  Date(this.today);
      this.sevenDaysBack.setDate(this.today.getDate()-7)
     
    this.getEnumList()
    this.detailedRideFilterForm = this.formBuilder.group ({
      fromDate: [this.sevenDaysBack, [Validators.required]],
      toDate: [this.today, [Validators.required]],
      enumId: [0, [Validators.required]],
      userName:[''],
      mobile:[''],
      lockNumber:[''],
      mapStateId:[[0]],
      mapCityId:[[0]],
      startAreaTypeEnumId:[[0]],
      startAreaId:[[0]],
      startZoneId:[[0]],
      endAreaId: [[0]],
      endZoneId:[[0]]

    });    
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'fromRideTime',
        display: 'Ride Start Date Time',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'toRideTime',
        display: 'Ride End Date Time',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      
      {
        key: 'userName',
        display: 'User Name',
        sort: true,
      },
      {
        key: 'mobileNo',
        display: 'Mobile No.',
        sort: true,
      },
      // {
      //   key: 'lockNumber',
      //   display: 'Lock No.',
      //   sort: true,
      // },
      {
        key: 'bikeName',
        display: 'Vehicle ID',
        sort: true,
      },
      {
        key: 'modelName',
        display: 'Model',
        sort: true,
      },
      {
        display: 'IOT Device ID',
        key: 'lockNumber',
        sort: true,
      },
      {
        display: 'Booking No.',
        key: 'rideBookingNo',
        sort: true,
      },
      {
        display: 'Start Zone',
        key: 'rideStartZoneName',
        sort: true,
      },
      {
        display: 'End Zone',
        key: 'rideEndZoneName',
        sort: true,
      },
      
      {
        display: 'Distance (m)',
        key: 'distanceInMeters',
        sort: true,
      },
      
      {
        key: 'minimumRentRate',
        display: ' Ride Rate',
        sort: true,
      },
      {
        key: 'actualRideMin',
        display: 'Ride Duration In Minutes',
        sort: true,
      },
      {
        key: 'minimumHiringTime',
        display: 'Minimum Duration Required',
        sort: true,
      },
      {
        key: 'totalRideAmount',
        display: 'Ride Amount',
        sort: true,
      },
      {
        key: 'bikeRideingStatus',
        display: 'Ride Status',
        sort: true,
      },
      
      {
        key: 'endRideRemark',
        display: 'Remark',
        sort: true,
      },
      {
        display: 'Rating',
        key: 'rideRating',
        sort: true,
      },
      {
        display: 'Comments',
        key: 'rideComments',
        sort: true,
      },
      {
        display: 'Comments Date',
        key: 'commentsReplyDate',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        display: 'Comments Reply',
        key: 'rideCommentsReply',
        sort: true,
      },

    ];
    this.setDefaultConfig();
    // this.getEnumList()/
  }
  setDefaultConfig() {
    //State
    this.rideStatusDropdown.label = 'Select Ride Status';
    this.rideStatusDropdown.key = 'enum_id'
    this.rideStatusDropdown.displayKey = 'name'
    this.getState(0)
    this.getAreaType();
     // State Dropdown
     this.stateDropdown.label = 'Select State'
     this.stateDropdown.key = 'mapStateId'//"state_id"
     this.stateDropdown.displayKey = 'mapStateName'//'state_name'
     this.stateDropdown.multiple =  true
  
     // city Dropdown
     this.cityDropdown.label = 'Select City';
     this.cityDropdown.key = 'mapCityId'
     this.cityDropdown.displayKey = 'mapCityName'
     this.cityDropdown.multiple =  true
  
     //AreaType
     this.areaTypeDropdown.label = 'Select Area Type';
     this.areaTypeDropdown.key = 'enum_id',//'id';
     this.areaTypeDropdown.displayKey ='name';
     this.areaTypeDropdown.multiple =  true
  
     //area
     this.areaDropdown.label ='Select  Start Area';
     this.areaDropdown.key = 'areaId'
     this.areaDropdown.displayKey = 'name'
     this.areaDropdown.multiple=  true
      //zone id
      this.zoneDropdown.label = 'Select Start Zone';
      this.zoneDropdown.displayKey = 'name';
      this.zoneDropdown.key = 'id';
      this.zoneDropdown.multiple = true;
      //
      this.areaDropdownEnd.label ='Select  End Area';
      this.areaDropdownEnd.key = 'areaId'
      this.areaDropdownEnd.displayKey = 'name'
      this.areaDropdownEnd.multiple=  true
       //zone id
       this.zoneDropdownEnd.label = 'Select End Zone';
       this.zoneDropdownEnd.displayKey = 'name';
       this.zoneDropdownEnd.key = 'id';
       this.zoneDropdownEnd.multiple = true;
  }

  getEnumList(){
    this.subsciption.push(
      this.reportService
        .GetEnumDetails('ride status')
        .subscribe((res) => {
          console.log(res);
          if (res.statusCode === 200) {
           let array = res.data;
         let  obj={
            enum_id:0,
            name:"All"
           }
           array.push(obj)
           this.enumData= array
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );
  }
  getState(id) {
    this.subsciption.push(this.reportService.getMapState(id).subscribe((res) => {
       if (res.statusCode === 200) {
         this.stateData = res.data;
      
       } else {
         this.toastr.warning(res.message)
       }
     }))
   }
  
   getCitys(){
  
    this.subsciption.push(this.reportService.getMapCity(this.detailedRideFilterForm.value.mapStateId).subscribe((res) => {
      if (res.statusCode === 200) {
        this.cityData = res.data;
     
      } else {
        this.toastr.warning(res.message)
      }
    }))
   }
  
  
  getAreaType(){
    this.subsciption.push(
      this.reportService.GetEnumDetails(AREATYPE).subscribe((res) => {
        if (res.statusCode === 200) {
          this.spinner.hide();
          this.areaTypeData = res.data;
        } else {
          this.spinner.hide();
          // this.toastr.warning(res.message)
        }
      })
    )
  }
  
  getAreaList(){
    const data = 
    {
      areaId:0,
      mapCityId:this.detailedRideFilterForm.value.mapCityId,
      areaTypeEnumId:this.detailedRideFilterForm.value.startAreaTypeEnumId
    }
    this.subsciption.push(this.reportService.getMapArea(data).subscribe((res) => {
      if (res.statusCode === 200) {
        this.areaList = res.data;
     
      } else {
        this.toastr.warning(res.message)
      }
    }))
  }
  getZoneList(){
    const  data ={
      areaId:this.detailedRideFilterForm.value.startAreaId,
      zoneId:0 // static
    }
    this.subsciption.push(this.reportService.getZoneList(data).subscribe((res) => {
      if (res.statusCode === 200) {
        this.zoneData = res.data;
     
      } else {
        this.toastr.warning(res.message)
      }
    }))
  }
  getlistByDate(){
    this.tableData=[]
    let fromDate = this.datePipe.transform(
      this.detailedRideFilterForm.value.fromDate,
      'yyyy-MM-dd'
    );
    let toDate = this.datePipe.transform(
      this.detailedRideFilterForm.value.toDate,
      'yyyy-MM-dd'
    );
     let id =  this.detailedRideFilterForm.value.enumId
     let userName = this.detailedRideFilterForm.value.userName
    let mobile =  this.detailedRideFilterForm.value.mobile
    let lock = this.detailedRideFilterForm.value.lockNumber
    console.log(fromDate, toDate);
    const data ={
      ...this.detailedRideFilterForm.value,
       fromDate:fromDate,
       toDate:toDate,
       userId:0,
       bikeId:0,
       bikeRideingStatusEnumId:15,
      
       }
    this.spinner.show()
    this.subsciption.push(
      this.reportService
        .getRideEarningDetailReport(data)
        .subscribe((res) => {
          console.log(res);
          if (res.statusCode === 200) {
          this.spinner.hide()
          let array = res.data;
          array.forEach(e=>{
            if(e.actualRideMin){
               e.actualRideMin= Number(e.actualRideMin)
            }
          })
          this.tableData = array
          } else {
            this.spinner.hide()
            // this.toastr.warning(res.message);
          }
        },
        err => this.spinner.hide())
    );
  }

  submit() {
    if (this.detailedRideFilterForm.invalid) {
      this.detailedRideFilterForm.markAllAsTouched();
      return;
    }
    let fromDate = this.datePipe.transform(
      this.detailedRideFilterForm.value.fromDate,
      'yyyy-MM-dd'
    );
    let toDate = this.datePipe.transform(
      this.detailedRideFilterForm.value.toDate,
      'yyyy-MM-dd'
    );

    if (fromDate > toDate) {
      this.toastr.warning('From Date Can not be Greater than To Date.');
      return;
    }
    this.getlistByDate()
  }
}
