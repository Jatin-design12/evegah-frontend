import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AVAILABLE, Active, Available, BEEPBUTTON, ENDBUTTON, LIGHTBUTTON, LOCKBUTTON, MAINTENANCE, UnderMaintenance } from 'src/app/core/constants/common-constant';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { ReportService } from 'src/app/core/services/report/report.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-dashboard-map-bike-modal',
  templateUrl: './dashboard-map-bike-modal.component.html',
  styleUrls: ['./dashboard-map-bike-modal.component.scss']
})
export class DashboardMapBikeModalComponent implements OnInit {

  cols=[]
  tableData=[]

  cols2=[]
  tableData2=[]

  UserCurrentcols =[]
  UserCurrenttableData =[]

  RidebyLockcols =[]
  RidebyLocktableData=[]

  RidebyUsercols=[]
  RidebyUsertableData=[]

  last10Transactionscols=[]
  last10TransactionstableData=[]

  UM= UnderMaintenance
  AV= Available
  Active = Active
  isShow:boolean =false
  subscription: Subscription[]=[]
  constructor(private toastr: ToastrService,
    private datePipe: DatePipe, private spinner: NgxSpinnerService ,
    private dashboardService :DashboardService, private userService:UserService,
    public dialogRef: MatDialogRef<DashboardMapBikeModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)

    this.getData4Active()

    this.setColsTable()
    
    if(this.data.bikeStatusName == this.Active) this.isShow=true
    else this.isShow=false
    
    this.setAllTableCols()
  }

  setColsTable(){
    if(this.data.bikeStatusName == UnderMaintenance){
      this.cols = [
        {
          key: 'ids',
          display: 'Sr.No.',
          sort: false,
          config: { isIndex: true },
        },
        
        {
          key: 'bikeName',
          display: 'Vehicle ID',
          sort: true,
        },
        {
          key: 'lockNumber', //lockId
          display: 'IOT Device ID',
          sort: true,
        },

        {
          key: 'zoneName',
          display: 'Zone',
          sort: true,
        },
        
        
        {
          key: 'geoFenceInOut',
          display: 'Geo Fence Status',
          sort: true,
        },
        {
          key: 'device_lock_unlock_status',
          display: 'Device Locking Status',
          sort: true,
          // config: {isTime :true  ,format: 'shortTime'},
        },
        {
          key: 'instructionName',
          display: 'IOT Device  Instruction Name',
          sort: true,
        },
        {
          key: 'deviceLightStatus',
          display: 'light Status',
          sort: true,
        },
        {
          key: 'deviceLightInstruction',
          display: 'Light Instruction Name',
          sort: true,
        },
        {
          key: 'beepStatusName',
          display: 'Beep Status',
          sort: true,
        },
        {
          key: 'beepInstructionName',
          display: 'Beep Instruction Name',
          sort: true,
        },

        {
          key: 'deveiceStatus',
          display: 'Device Status',
          sort: true,
        },
        {
          key: 'deviceLastRequestTime',
          display: 'Last Requested Time',
          config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' },
        },
        {
          key: 'batteryPercentage',
          display: 'Battery %',
          sort: true,
        },
        {
          key: 'bikeProduceIds',
          display: 'Action',
          sort: false,
          config: {
            actions: [
              AVAILABLE,
              LOCKBUTTON,
              LIGHTBUTTON,
              BEEPBUTTON,
            ],
            isbutton: true,
            isClickAble: true,
          },
        },
      ];
    }

    else if(this.data.bikeStatusName == Active){
      this.cols = [
        {
          key: 'id',
          display: 'Sr.No.',
          sort: false,
          config: { isIndex: true },
        },
        {
          key: 'userName',
          display: 'User Name',
          sort: true,
        },
        {
          key: 'mobileNumber',
          display: 'Contact',
          sort: true,
        },
      
        {
          key: 'bikeName',
          display: 'Vehicle ID',
          sort: true,
        },
        {
          key: 'fromRideTime',
          display: 'Ride Start Time',
          sort: true,
          config: { isTime: true, format: 'shortTime' },
        },
  
        {
          key: 'lockNumber', //lockId
          display: 'IOT Device ID',
          sort: true,
        },
        {
          key: 'rideBookingNo',
          display: 'Ride Booking No',
          sort: true,
        },
        {
          key: 'zoneName',
          display: 'Zone',
          sort: true,
        },
        {
          key: 'geoFenceInOut',
          display: 'Geo Fence Status',
          sort: true,
        },
        {
          key: 'device_lock_unlock_status',
          display: 'Device Locking Status',
          sort: true,
        },
        {
          key: 'instructionName',
          display: 'IOT Device  Instruction Name',
          sort: true,
        },
  
        {
          key: 'deviceLightStatus',
          display: 'light Status',
          sort: true,
        },
  
        {
          key: 'deviceLightInstruction',
          display: 'Light Instruction Name',
          sort: true,
        },
        {
          key: 'beepStatusName',
          display: 'Beep Status',
          sort: true,
        },
        {
          key: 'beepInstructionName',
          display: 'Beep Instruction Name',
          sort: true,
        },
  
        {
          key: 'deveiceStatus',
          display: 'Device Status',
          sort: true,
        },
        {
          key: 'deviceLastRequestTime',
          display: 'Last Requested Time',
          config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' },
        },
        {
          key: 'batteryPercentage',
          display: 'Battery %',
          sort: true,
        },
  
        {
          key: 'bikeProduceIds',
          display: 'Action',
          sort: false,
          config: {
            actions: [
              ENDBUTTON,
              LOCKBUTTON,
              LIGHTBUTTON,
              BEEPBUTTON,
            ],
            isbutton: true,
            isClickAble: true,
          },
        },
      ];
    }

    else if(this.data.bikeStatusName == Available){
      this.cols = [
        {
          key: 'ids',
          display: 'Sr.No.',
          sort: false,
          config: { isIndex: true },
        },
        //  {
        //     key: 'id',
        //     display: 'Bike Id',
        //     sort: true,
        //   },
        {
          key: 'bikeName',
          display: 'Vehicle ID',
          sort: true,
        },
        {
          key: 'lockNumber', //lockId
          display: 'IOT Device ID',
          sort: true,
        },
  
        {
          key: 'zoneName',
          display: 'Zone',
          sort: true,
        },
        {
          key: 'geoFenceInOut',
          display: 'Geo Fence Status',
          sort: true,
        },
        {
          key: 'device_lock_unlock_status',
          display: 'Device Locking Status',
          sort: true,
        },
        {
          key: 'instructionName',
          display: 'IOT Device  Instruction Name',
          sort: true,
        },
        {
          key: 'deviceLightStatus',
          display: 'light Status',
          sort: true,
        },
        {
          key: 'deviceLightInstruction',
          display: 'Light Instruction Name',
          sort: true,
        },
  
        {
          key: 'beepStatusName',
          display: 'Beep Status',
          sort: true,
        },
        {
          key: 'beepInstructionName',
          display: 'Beep Instruction Name',
          sort: true,
        },
  
       
        {
          key: 'deveiceStatus',
          display: 'Device Status',
          sort: true,
        },
        {
          key: 'deviceLastRequestTime',
          display: 'Last Requested Time',
          config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' },
        },
        {
          key: 'batteryPercentage',
          display: 'Battery %',
          sort: true,
        },
        
        {
          key: 'bikeProduceIds',
          display: 'Action',
          sort: false,
          config: {
            actions: [
              MAINTENANCE,
              
              LOCKBUTTON,
              LIGHTBUTTON,
              BEEPBUTTON,
            ],
            isbutton: true,
            isClickAble: true,
          },
        },
      ];
    }

    

  }

  getData4Active(){
    const obj = {
      mapCityName: '',
      mapStateName: '',
      mapCountryName: '',
      rideId:this.data.rideBookingId  || 0,
      lockId:this.data.lockId || 0
    };

    if(this.data.bikeStatusName == UnderMaintenance){

      this.spinner.show()
      this.subscription.push(
        this.dashboardService.getBikeMaintenceListbyLockId(obj).subscribe((res) => {
          if (res.statusCode === 200) {
            res.data.forEach((element) => {
              element.locationData = true;
            });
            this.tableData = res.data;
            console.log(res.data, 'available');
            this.spinner.hide();
          } else if (res.statusCode === 422) {
            this.spinner.hide();
            this.toastr.warning(res.message);
          } else {
            this.spinner.hide();
            this.toastr.warning(res.message);
          }
        })
      );
    }
     else if(this.data.bikeStatusName == Active){
      this.spinner.show()
      this.subscription.push(
        this.dashboardService.getActiceListbyRideId(obj).subscribe((res) => {
          if (res.statusCode === 200) {
            res.data.forEach((element) => {
              element.locationData = true;
            });
            this.tableData = res.data;
            console.log(res.data, 'available');
            this.spinner.hide();
          } else if (res.statusCode === 422) {
            this.spinner.hide();
            this.toastr.warning(res.message);
          } else {
            this.spinner.hide();
            this.toastr.warning(res.message);
          }
        })
      );
     }

     else if(this.data.bikeStatusName == Available){
      this.spinner.show()
      this.subscription.push(
        this.dashboardService.getBikeAvailableListbyLockId(obj).subscribe((res) => {
          if (res.statusCode === 200) {
            res.data.forEach((element) => {
              element.locationData = true;
            });
            this.tableData = res.data;
            console.log(res.data, 'available');
            this.spinner.hide();
          } else if (res.statusCode === 422) {
            this.spinner.hide();
            this.toastr.warning(res.message);
          } else {
            this.spinner.hide();
            this.toastr.warning(res.message);
          }
        })
      );
     }
    
  }

  closemodel(){
    this.dialogRef.close(DashboardMapBikeModalComponent)
  }

  setAllTableCols(){
    this.RidebyLockcols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
     
      {
        key: 'userName',
        display: 'User Name',
        sort: true,
      },
      // {
      //   key: 'contact',
      //   display: 'Contact Number',
      //   sort: true,
      // },
      
      {
        key: 'modelName',
        display: 'model Name',
        sort: true,
      },
      {
        key: 'rideBookingNo',
        display: 'Ride Booking No',
        sort: true,
      },
      {
        key: 'bikeRidingStatusName',
        display: 'Vehicle Riding Status',
        sort: true,
      },
      {
        key: 'totalRideAmount',
        display: 'Total RideAmount',
        sort: true,
      },
      
      {
        key: 'createdOnDate',
        display: 'Created Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      
      { 
        key: 'minWalletAmount',
        display: 'Wallet Amount',
        sort: true,
      },
      { 
        key: 'rideBookingMinutes',
        display: 'Ride Booking Minutes',
        sort: true,
      },
      {
        key: 'rideStartZoneName',
        display: 'Ride Start ZoneName',
        sort: true,
      },
      
      {
        key: 'rideEndZonename',
        display: 'Ride End Zonename',
        sort: true,
      },
      {
        key: 'endRideUserName',
        display: 'End Ride UserName',
        sort: true,
      }
      ,
      {
        key: 'fromRideTime',
        display: 'From Time',
        sort: true,
        config: {isTime :true  ,format: 'hh:mm:ss'},
      }
      ,
      {
        key: 'toRideTime',
        display: 'To Time',
        sort: true,
        config: {isTime :true  ,format: 'hh:mm:ss'},
      },
      
      {
        key: 'minimumHiringTime',
        display: 'minimum Rental Time',
        sort: true,
      },
      {
        key: 'minimumRentRate',
        display: 'Minimum Rent Rate',
        sort: true,
      },
      {
        key: 'rideStartExtBatteryPercentage',
        display: 'Ride Start Ext Battery%',
        sort: true,
    
      },
      {
        key: 'mapCityName',
        display: 'City',
        sort: true,
      },
      
      
    ];

    this.RidebyUsercols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
     
      {
        key: 'userName',
        display: 'User Name',
        sort: true,
      },
      {
        key: 'lockNumber',
        display: 'IOT Device ID',
        sort: true,
      },
      // {
      //   key: 'contact',
      //   display: 'Contact Number',
      //   sort: true,
      // },
      
      {
        key: 'modelName',
        display: 'model Name',
        sort: true,
      },
      {
        key: 'rideBookingNo',
        display: 'Ride Booking No',
        sort: true,
      },
      {
        key: 'bikeRidingStatusName',
        display: 'Vehicle Riding Status',
        sort: true,
      },
      
      {
        key: 'totalRideAmount',
        display: 'Total RideAmount',
        sort: true,
      },
      
      {
        key: 'createdOnDate',
        display: 'Created Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      
      { 
        key: 'minWalletAmount',
        display: 'Wallet Amount',
        sort: true,
      },
      { 
        key: 'rideBookingMinutes',
        display: 'Ride Booking Minutes',
        sort: true,
      },
      {
        key: 'rideStartZoneName',
        display: 'Ride Start ZoneName',
        sort: true,
      },
      
      {
        key: 'rideEndZonename',
        display: 'Ride End Zonename',
        sort: true,
      },
      {
        key: 'endRideUserName',
        display: 'End Ride UserName',
        sort: true,
      }
      ,
      {
        key: 'fromRideTime',
        display: 'From Time',
        sort: true,
        config: {isTime :true  ,format: 'hh:mm:ss'},
      }
      ,
      {
        key: 'toRideTime',
        display: 'To Time',
        sort: true,
        config: {isTime :true  ,format: 'hh:mm:ss'},
      },
      
      {
        key: 'minimumHiringTime',
        display: 'minimum Rental Time',
        sort: true,
      },
      {
        key: 'minimumRentRate',
        display: 'Minimum Rent Rate',
        sort: true,
      },
      {
        key: 'rideStartExtBatteryPercentage',
        display: 'Ride Start Ext Battery%',
        sort: true,
    
      },
      {
        key: 'mapCityName',
        display: 'City',
        sort: true,
      },
      
      
    ];

    this.UserCurrentcols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'userName',
        display: 'User Name',
        sort: true,
      },
      {
        key: 'mobile',
        display: 'Contact Number',
        sort: true,
      },
      {
        key: 'emailId',
        display: 'Email Id',
        sort: true,
      },
      {
        key: 'address',
        display: 'Address',
        sort: true,
      },
      {
        key: 'totalRide',
        display: 'Total Ride',
        sort: true,
      },
      {
        key: 'totalDistanceInKm',
        display: 'Total Distance (km)',
        sort: true,
      },
      {
        key: 'totalAideAmount',
        display: 'Total Ride Amount',
        sort: true,
      },
      

      
      // {
      //   key: 'createdOnDate',
      //   display: 'Registration Date',
      //   sort: true,
      //   config: { isDate: true, format: 'dd-MM-yyyy' }
      // },
      {
        key: 'walletAmount',
        display: 'Wallet Amount',
        sort: true,
      },
      // {
      //   key: 'transctionValue',
      //   display: 'Total Transition Value',
      //   sort: true,
      // }
    ];


    this.last10Transactionscols =[
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'createdon_date',
        display: 'Transaction Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      // {
      //   key: 'user_name',
      //   display: 'User Name',
      //   sort: true,
      // },
      {
        key: 'OrderNumber',
        display: 'Order Number',
        sort: true,
      },
      { 
        key: 'method',
        display: 'Txn Type',
        sort: true,
      },
      {
        key: 'amount',
        display: 'Wallet Trxn',
        sort: true,
      },
      // {
      //   key: 'extra_charges',
      //   display: 'Prev Charges',
      //   sort: true,
      // },
      {
        key: 'hiring_charges',
        display: 'Riding Charges',
        sort: true,
      },
      {
        key: 'ride_booking_min',
        display: 'Booked Min.',
        sort: true,
      }
      ,
      {
        key: 'from_ride_time',
        display: 'From Time',
        sort: true,
        config: {isTime :true  ,format: 'hh:mm:ss'},
      }
      ,
      {
        key: 'to_ride_time',
        display: 'To Time',
        sort: true,
        config: {isTime :true  ,format: 'hh:mm:ss'},
      },
      // {
      //   key: 'transactionData',
      //   display: 'Locate',
      //   sort: false,
      //   config: { 
      //       isbutton: true, actions: [LOCATEBUTTON]  },
      // },
    ]; 
   
  }

  last10RidebyLock(){
    this.spinner.show()
     
    let userId = 0
    let lockId = this.data.lockId || 0
    this.subscription.push(
      this.dashboardService.getActiceBikeListbyuserIdandLockId(userId, lockId).subscribe((res) => {
        if (res.statusCode === 200) {
          res.data.forEach((element) => {
            element.locationData = true;
          });
          this.RidebyLocktableData = res.data;
          console.log(res.data, 'available');
          this.spinner.hide();
        } else if (res.statusCode === 422) {
          this.spinner.hide();
          this.toastr.warning(res.message);
        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );
  }

  last10RidebyUser(){
    this.spinner.show()
    let userId = this.data.userId
    let lockId =  0
    this.subscription.push(
      this.dashboardService.getActiceBikeListbyuserIdandLockId(userId, lockId).subscribe((res) => {
        if (res.statusCode === 200) {
          res.data.forEach((element) => {
            element.locationData = true;
          });
          this.RidebyUsertableData = res.data;
          console.log(res.data, 'available');
          this.spinner.hide();
        } else if (res.statusCode === 422) {
          this.spinner.hide();
          this.toastr.warning(res.message);
        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );
  }

  last10Transactions(){
    this.spinner.show()
    let userId = this.data.userId
    this.subscription.push(
      this.dashboardService.getLastTenTransactionList(userId).subscribe((res) => {
        if (res.statusCode === 200) {
          
          this.last10TransactionstableData = res.data;
          console.log(res.data, 'available');
          this.spinner.hide();
        } else if (res.statusCode === 422) {
          this.spinner.hide();
          this.toastr.warning(res.message);
        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );
  }

  UserCurrentWallet(){
    this.spinner.show()

   

    let userId = this.data.userId
      this.subscription.push(this.userService.getUserList(userId,1).subscribe((res) => {
        if(res.statusCode === 200){
          res.data.forEach(element => {
            element.transctionValue = 0;
            element.walletAmount = Math.floor( element.walletAmount) 
          });
          this.UserCurrenttableData = res.data;
          console.log("userdats", this.UserCurrenttableData)
          this.UserCurrenttableData.sort((x,y)=>+new Date(y.createdOnDate) - +new Date(x.createdOnDate))
          this.spinner.hide();
        }else{
          this.toastr.warning(res.message)
          this.spinner.hide();
        }
      }))
    
  }

}
