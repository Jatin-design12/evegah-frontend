import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MAINTENANCE, REPLY, ReplyCommentsStatus, fe_action_add, fe_request_from_admin } from 'src/app/core/constants/common-constant';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model'
import { ReportService } from 'src/app/core/services/report/report.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-ride-rating',
  templateUrl: './ride-rating.component.html',
  styleUrls: ['./ride-rating.component.scss']
})
export class RideRatingComponent implements OnInit {
  detailedRideFilterForm: FormGroup; 
  heading: string ; 
  rideStarDropdown = new Uiconfig();
  commentStatusDropdown =new Uiconfig();
  detailedRideList = [];
  cols = [];
  starEnumData:any =[
    {
      "enum_id": 0,
      "name": "0",
      "display_name": "0",
    },
    {
      "enum_id": 1,
      "name": "1",
      "display_name": "1",
    },
    {
      "enum_id": 2,
      "name": "2",
      "display_name": "2",
    },{
      "enum_id": 3,
      "name": "3",
      "display_name": "3",
    },{
      "enum_id": 4,
      "name": "4",
      "display_name": "4",
    },
    {
      "enum_id": 5,
      "name": "5",
      "display_name": "5",
    },
  ]
  commentEnumData:any =[]
  subscription: Subscription[] = [];
  tableData: any = [];
  today= new Date()
  sevenDaysBack :Date
  constructor(public formBuilder: FormBuilder,
    private reportService: ReportService,
    private userServices:UserService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.getCommentEnumList()
    this.sevenDaysBack =  new  Date(this.today);
    this.sevenDaysBack.setDate(this.today.getDate()-7)
    this.detailedRideFilterForm = this.formBuilder.group ({
      fromDate: [this.sevenDaysBack, [Validators.required]],
      toDate: [this.today, [Validators.required]],
      rating: [[], []],
      commentEnumId: [0, []],
      userName:[''],
      mobile:['', [Validators.maxLength(10)]]


    });    
    this.cols = [
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
        display: 'Mobile No.',
        sort: true,
      },
      // {
      //   key: 'lockNumber',
      //   display: 'Lock No.',
      //   sort: true,
      // },
      // {
      //   key: 'bikeName',
      //   display: 'BikeName',
      //   sort: true,
      // },

      {
        key: 'modelName',
        display: 'Model',
        sort: true,
      },
      {
        key: 'rideBookingNo',
        display: 'Ride Booking No',
        sort: true,
      },
     
      {
        key: 'fromRideTime',
        display: 'Ride Start',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'toRideTime',
        display: 'Ride End',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      
      {
        key: 'minimumRentRate',
        display: ' Ride Rate',
        sort: true,
      },
      {
        key: 'rideBookingMin',
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
      // {
      //   key: 'bikeRideingStatus',
      //   display: 'Ride Status',
      //   sort: true,
      // },
      {
        key: 'rideStartZone',
        display: 'Start Zone',
        sort: true,
      },
      {
        key: 'rideEndZone',
        display: 'End Zone',
        sort: true,
      },

      
      
      {
        key: 'endRideRemark',
        display: 'Remark',
        sort: true,
      }, {
        key: 'rideRating',
        display: 'RideRating',
        sort: true,
      },
      {
        key: 'rideComments',
        display: 'Ride Comments',
        sort: true,
      },
      {
        key: 'rideCommentsReply',
        display: 'Ride Comments Reply',
        sort: true,
      },
      {
        key: 'bikeProduceIds',
        display: 'Action',
        sort: false,
        config: {
          actions: [
            // MAINTENANCE, 
            REPLY
          ],
          isbutton: true,
          isClickAble: true,
        },
      },

    ];
    this.setDefaultConfig();
    // this.getEnumList()/
  }
  setDefaultConfig() {
    //State
    this.rideStarDropdown.label = 'Select Ride Star';
    this.rideStarDropdown.key = 'enum_id'
    this.rideStarDropdown.displayKey = 'name'
    this.rideStarDropdown.multiple = true

    this.commentStatusDropdown.label = 'Reply Comments';
    this.commentStatusDropdown.key = 'enum_id'
    this.commentStatusDropdown.displayKey = 'name'
    // this.commentStatusDropdown.multiple = true

  }

  getCommentEnumList(){
    this.subscription.push(
      this.reportService
        .GetEnumDetails(ReplyCommentsStatus)
        .subscribe((res) => {
          console.log(res);
          if (res.statusCode === 200) {
            let obj = {
              enum_id: 0,
              statusName: 'Select All',
              name: 'Select All',

            };
            res.data.unshift(obj)
            this.commentEnumData = res.data;
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );
  }

  getListByDate(){
    this.tableData=[]
    let fromDate = this.datePipe.transform(
      this.detailedRideFilterForm.value.fromDate,
      'yyyy-MM-dd'
    );
    let toDate = this.datePipe.transform(
      this.detailedRideFilterForm.value.toDate,
      'yyyy-MM-dd'
    );

    let obj:any={
      fromDate :fromDate,
      toDate:toDate,
      rideRating:this.detailedRideFilterForm.value.rating,
      commentsReplyStatusEnumId:this.detailedRideFilterForm.value.commentEnumId,
      userName:this.detailedRideFilterForm.value.userName,
      mobileNo: this.detailedRideFilterForm.value.mobile
      
     }

    obj.add = 'Search';//fe_action_add;
    obj.req = fe_request_from_admin;
    obj.pageName = 'RideRatingComponent';
    obj.option = 'Ride Rating';
   
    this.spinner.show()
    this.subscription.push(
      this.userServices
        .getRideRatingSearchButton(obj)
        .subscribe((res) => {
          console.log(res);
          if (res.statusCode === 200) {
          this.spinner.hide()
          res.data.forEach((element) => {
            element.locationData = true;
          });
          let array = res.data;
          // array.forEach(e=>{
          //   if(e.actualRideMin){
          //      e.actualRideMin= Number(e.actualRideMin)
          //   }
          // })
          this.tableData = array
          } else {
            this.spinner.hide()
            // this.toastr.warning(res.message);
          }
        })
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
    this.getListByDate()
  }

  checkUpdate(event){
    this.getListByDate()
  }

  starCheck:boolean =false
  selectAllStar(e, data){
    if (e.length === data.length) this.starCheck = true;
    else this.starCheck = false;
  }
}

