import { DatePipe } from '@angular/common';
import { Component, OnInit,Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ReportService } from 'src/app/core/services/report/report.service';
import { TransactionService } from 'src/app/core/services/userTransaction/transaction.service';

@Component({
  selector: 'app-user-tansaction-detail',
  templateUrl: './user-tansaction-detail.component.html',
  styleUrls: ['./user-tansaction-detail.component.scss']
})
export class UserTansactionDetailComponent implements OnInit {

  cols:any=[]
  subscription: Subscription[] = [];
  rowData :any= []
  transactionData = []
  constructor(private toastr: ToastrService,private transactionService: TransactionService, 
    private spinner: NgxSpinnerService ,private router :Router,
    private reportService: ReportService, private datePipe:DatePipe,
    public dialogRef: MatDialogRef<UserTansactionDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.userTransaction();
    // this.cols = [
    //   {
    //     key: 'sno',
    //     display: 'S.No.',
    //     sort: false,
    //     config: { isIndex: true },
    //   },
    //   {
    //     key: 'createdon_date',
    //     display: 'Transaction Date',
    //     sort: true,
    //     config: { isDate: true, format: 'dd-MM-yyyy' }
    //   },
     
    //   { 
    //     key: 'method',
    //     display: 'Txn Type',
    //     sort: true,
    //   },
    //   {
    //     key: 'amount',
    //     display: 'Wallet Trxn',
    //     sort: true,
    //   },
    //   // {
    //   //   key: 'extra_charges',
    //   //   display: 'Prev Charges',
    //   //   sort: true,
    //   // },
    //   {
    //     key: 'hiring_charges',
    //     display: 'Hiring Charges',
    //     sort: true,
    //   },
    //   {
    //     key: 'ride_booking_min',
    //     display: 'Booked Hours',
    //     sort: true,
    //   }
    //   ,
    //   {
    //     key: 'from_ride_time',
    //     display: 'From Time',
    //     sort: true,
    //     config: {isTime :true  ,format: 'hh:mm:ss'},
    //   }
    //   ,
    //   {
    //     key: 'to_ride_time',
    //     display: 'To Time',
    //     sort: true,
    //     config: {isTime :true  ,format: 'hh:mm:ss'},
    //   },
     
    // ]; 

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
        key: 'lockNumber',
        display: 'IOT Device ID.',
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
   
  }
  
  toDate= new Date()
  userTransaction(){
  //  console.log( this.data)
   let toDate = this.datePipe.transform(
    this.toDate,
    'yyyy-MM-dd'
  );

   let fromDate = '2024-01-01';
    let enumId = 0;
    let id = this.data.id;
  
    let obj ={
      
        "fromDate": fromDate,
        "toDate":  toDate,
        "userId": id,
        "userName": "",
        "mobile": "",
        "lockNumber": "",
        "mapStateId": [
          0
        ],
        "mapCityId": [
          0
        ],
        "startAreaTypeEnumId": [
          0
        ],
        "startAreaId": [
          0
        ],
        "startZoneId": [
          0
        ],
        "endAreaId": [
          0
        ],
        "endZoneId": [
          0
        ],
       
       
       
      
    }
    this.spinner.show();
    this.subscription.push(
      // this.transactionService.TransactionDetails
      // (this.data.id)
      this.reportService
      .getUserIdRideEarningReport(obj)
      .subscribe((res) => {
      if(res.statusCode === 200){
       
          //ride_booking_min
          // res.data.sort(
          //   (objA, objB) => objB.createdon_date - objA.createdon_date,
          // );
         
          // res.data.forEach(element => {
          //   if( element.ride_booking_min == null){
          //     element.ride_booking_min = "No Ride Taken "
          //   }else if ( !element.ride_booking_min.includes('m')) {
          //     element.ride_booking_min =  element.ride_booking_min + 'm'
          //   }else if(  element.method == "Add Amount In Wallet" ){
          //     element.ride_booking_min = "no ride taken "
          //   }
          //   if(element?.rideEndLatitude != null || element?.rideEndLongitude != null||element?.rideStartLatitude!= null || 
          //     element?.rideStartLongitude!= null){
          //         element.locationData = true
          //   }else{
          //     element.locationData = false
          //   }
          // });

          this.transactionData = res.data;
          // console.log("TransactionDetails", this.transactionData );
          this.spinner.hide();
      }else{
          this.toastr.warning(res.message)
          this.spinner.hide();
      }
    }))
  }

  onActionHandler(event){
    console.log(event)
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     data: JSON.stringify(event)
    //   },  
    // };
    // this.router.navigate(['./main'], navigationExtras  );
   
  }

  closemodel(){
    
    this.dialogRef.close(UserTansactionDetailComponent)
  }
}

