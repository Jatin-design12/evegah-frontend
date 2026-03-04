import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AREATYPE, VIEW } from 'src/app/core/constants/common-constant';
import { ReportService } from 'src/app/core/services/report/report.service';
import { BikedetailsComponent } from '../bikedetails/bikedetails.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';

@Component({
  selector: 'app-bike-wise-list',
  templateUrl: './bike-wise-list.component.html',
  styleUrls: ['./bike-wise-list.component.scss']
})
export class BikeWiseListComponent implements OnInit {
  bikeFilterForm: FormGroup; 
  heading: string ; 
  bikeWiseList = [];
  cols= [];
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
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dailogRef: MatDialog,
    private spinner: NgxSpinnerService,
  ) {}

  today= new Date()
  sevenDaysBack :Date
  ngOnInit(): void {
    this.sevenDaysBack =  new  Date(this.today);
    this.sevenDaysBack.setDate(this.today.getDate()-7)
    this.bikeFilterForm = this.formBuilder.group ({
      fromDate: [this.sevenDaysBack, [Validators.required]],
      toDate: [this.today, [Validators.required]],
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
        key: 'bikeName',
        display: 'Vehicle ID',
        sort: true,
      }, 
      {
        key: 'totalRide',
        display: 'Total Rides',
        sort: true,
      },
      {
        key: 'totalRideAmount',
        display: 'Total Rides Amount',
        sort: true,
      }, 
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isAction: true, actions: [VIEW] },
      },
    ]
    this.setDefaultConfig()

    
  }
  setDefaultConfig(){
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
  
    this.subsciption.push(this.reportService.getMapCity(this.bikeFilterForm.value.mapStateId).subscribe((res) => {
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
      mapCityId:this.bikeFilterForm.value.mapCityId,
      areaTypeEnumId:this.bikeFilterForm.value.startAreaTypeEnumId
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
      areaId:this.bikeFilterForm.value.startAreaId,
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

  getBikelistByDate() {
    this.tableData=[]
    let fromDate = this.datePipe.transform(
      this.bikeFilterForm.value.fromDate,
      'yyyy-MM-dd'
    );
    let toDate = this.datePipe.transform(
      this.bikeFilterForm.value.toDate,
      'yyyy-MM-dd'
    );
    console.log(fromDate, toDate);
    let userName = this.bikeFilterForm.value.userName
    let mobile =  this.bikeFilterForm.value.mobile
    let lock = this.bikeFilterForm.value.lockNumber
    this.spinner.show()
    const data ={
      ...this.bikeFilterForm.value,
       fromDate:fromDate,
       toDate:toDate,
       userId:0,
       bikeId:0,
       bikeRideingStatusEnumId:15,
      
       }
    this.subsciption.push(
      this.reportService
        .getbikeWiseRideEarningReport(data)
        .subscribe((res) => {
          console.log(res);
          if (res.statusCode === 200) {
            this.spinner.hide()
            this.tableData = res.data;
          } else {
            this.spinner.hide()
            // this.toastr.warning(res.message);
          }
        },
        err => this.spinner.hide())
    );
  }

  submit() {
    if (this.bikeFilterForm.invalid) {
      this.bikeFilterForm.markAllAsTouched();
      return;
    }
    let fromDate = this.datePipe.transform(
      this.bikeFilterForm.value.fromDate,
      'yyyy-MM-dd'
    );
    let toDate = this.datePipe.transform(
      this.bikeFilterForm.value.toDate,
      'yyyy-MM-dd'
    );

    if (fromDate > toDate) {
      this.toastr.warning('From Date Can not be Greater than To Date.');
      return;
    }
    this.getBikelistByDate()
  }

  onActionHandler(event) {
    if (event.action === 'visibility') {
      this.viewDetail(event.data);
    }
  }

  viewDetail(data) {
    let fromDate = this.datePipe.transform(
      this.bikeFilterForm.value.fromDate,
      'yyyy-MM-dd'
    );
    let toDate = this.datePipe.transform(
      this.bikeFilterForm.value.toDate,
      'yyyy-MM-dd'
    );
    data.fromDate = fromDate;
    data.toDate = toDate;
    data.fromDatefull = this.bikeFilterForm.value.fromDate;
    data.toDatefull = this.bikeFilterForm.value.toDate;
    const  obj ={
      ...this.bikeFilterForm.value,
      ...data,
      fromDate:fromDate,
      toDate:toDate
    }
    this.openDialogTansaction(obj);
  }

  openDialogTansaction(e) {
    const dialogRef = this.dailogRef.open(BikedetailsComponent, {
      data: e,
      height: '800px',
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`); // Pizza!
      if (result) {
        // console.log(result);
        // dialogRef.close({ refreshing: true })
      }
    });
  }

}
