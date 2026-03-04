import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ReportService } from 'src/app/core/services/report/report.service';


@Component({
  selector: 'app-bikedetails',
  templateUrl: './bikedetails.component.html',
  styleUrls: ['./bikedetails.component.scss']
})
export class BikedetailsComponent implements OnInit {
  cols: any = [];
  subscription: Subscription[] = [];
  tableData = [];
  constructor(
    private toastr: ToastrService,
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef< BikedetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

   
  ) {}

  ngOnInit(): void {
    console.log(this.data, 'data');
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
      // {
      //   key: 'bikeName',
      //   display: 'BikeId',
      //   sort: true,
      // },
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
      {
        key: 'modelName',
        display: 'Model',
        sort: true,
      },
      {
        key: 'lockNumber',
        display: 'IOT Device ID',
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

    this.getUserIdByDetail();
  }

  getUserIdByDetail() {
    let fromDate = this.data.fromDate;
    let toDate = this.data.toDate;
    let enumId = 0;
    let id = this.data.bikeId;

    console.log(fromDate, toDate);
    this.spinner.show()
    this.subscription.push(
      this.reportService
        .getbikeIdRideEarningReport(this.data)
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
            this.spinner.show()
            // this.toastr.warning(res.message);
          }
        })
    );
  }

  closemodel() {
    this.dialogRef.close(BikedetailsComponent);
  }
}
