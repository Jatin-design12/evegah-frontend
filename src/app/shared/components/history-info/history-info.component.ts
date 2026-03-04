import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject,Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { ReportService } from 'src/app/core/services/report/report.service';

@Component({
  selector: 'app-history-info',
  templateUrl: './history-info.component.html',
  styleUrls: ['./history-info.component.scss']
})
export class HistoryInfoComponent implements OnInit {

  cols:any=[]
  tableData:[]=[]
  HistoryForm:FormGroup
  rideStatusDropdown = new Uiconfig();
  historyStatusDropdown = new Uiconfig();
  rideData=[
    
  ]
  historyData=[
    {
      id:1,name:"Available"
    },
    {
      id:2,name:"Not Available"
    },
    {
      id:3,name:"Both"
    }
  ]
  subsciption:Subscription[]=[]
  today=new Date()

  constructor(private toastr: ToastrService,private fb:FormBuilder,
    private datePipe: DatePipe,
    private reportService :ReportService,
    public dialogRef: MatDialogRef<HistoryInfoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data,"data")
    this.HistoryForm = this.fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      rideStatus: [, [Validators.required]],
      historyStatus: [0, [Validators.required]],
    });
    this.setDefaultConfig()
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      // {
      //   key: 'actionBTN',
      //   display: 'Action',
      //   sort: false,
      //   config: {
      //     isbutton: true,
      //     isClickAble: true,
      //     actions: [LOCKBUTTON, LOCATEBUTTON, LIGHTBUTTON, HISTORY],
      //   },
      // },
      // {
      //   key: 'device_lock_and_unlock_status1',
      //   display: '',
      //   sort: false,
      //   config: {
      //     isbutton: true,
      //     isClickAble: true,
      //     actions: [ LOCATEBUTTON,

      //     ],

      //     //LOCKBUTTON || UNLOCKBUTTON offLIGHTBUTTON
      //   },
      // },
      // {
      //   key: 'device_lock_and_unlock_status2',
      //   display: '',
      //   sort: false,
      //   config: {
      //     isbutton: true,
      //     isClickAble: true,
      //     actions: [ LIGHTBUTTON

      //     ],

      //     //LOCKBUTTON || UNLOCKBUTTON offLIGHTBUTTON
      //   },
      // },

      {
        key: 'lockNumber',
        display: 'IOT Device ID',
        sort: true,
        //config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },

      {
        key: 'lockStatus',
        display: ' IOT Device Status',
        sort: true,
      },
      {
        key: 'instructionName',
        display: 'Device Instruction ',
        sort: true,
      },
      {
        key: 'deviceLightStatus',
        display: 'light Status',
        sort: true,
      },

      {
        key: 'deviceLightInstruction',
        display: 'Light Instruction',
        sort: true,
      },

      {
        key: 'latitude',
        display: 'Latitude',
        sort: true,
      },
      {
        key: 'longitude',
        display: 'Longitude',
        sort: true,
      },
      
      {
        key: 'batteryPercentage',
        display: 'Battery %',
        sort: true,
      },

      {
        key: 'internalBatteryVoltage',
        display: 'Internal Battery Voltage',
        sort: true,
      },
      {
        key: 'externalBatteryVoltage',
        display: 'External Battery Voltage',
        sort: true,
      },
      {
        key: 'speed',
        display: 'Speed',
        sort: true,
      },
      {
        key: 'altitude',
        display: 'Altitude',
        sort: true,
      },

      {
        key: 'deveiceState',
        display: 'Deveice State',
        sort: true,
      },
      {
        key: 'allotmentStatus',
        display: 'Allotment Status',
        sort: true,
      },
      {
        key: 'lockIMEINumber',
        display: 'IOT Device IMEI No.',
        sort: true,
      },
      {
        key: 'devicestatus',
        display: 'Device Status',
        sort: true,
      },
      {
        key: 'lastdateforaltitude',
        display: 'Last Update for Altitude',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      {
        key: 'lastdateforbatterypercentage',
        display: 'Last Update for Battery %',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      {
        key: 'lastdateforexternalbatteryvolt',
        display: 'Last Update for External Battery volt.',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      {
        key: 'lastdateforinternalbatteryvolt',
        display: 'Last Update for Internal Battery volt.',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      {
        key: 'lastdateforlightonoff',
        display: 'Last Update for Light on/off',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      {
        key: 'lastdateforlockunlock',
        display: 'Last Update for lock/unlock',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      {
        key: 'lastdateforspeed',
        display: 'Last Update for Speed',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      {
        key: 'lastdateforlatlong',
        display: 'Last Update for lat/lng',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' }
      },
      

      {
        key: 'createdonDate',
        display: 'Created Date',
        sort: true,
        config: { isDate: true, format: 'dd-MM-yyyy' }, //'dd-MM-yyyy, h:mm:ss a'
      },
    ];
    let id=this.data.lockId
    // this.getHistorytableDataByLockId(id)
  }
  

  setDefaultConfig() {
    //State
    this.rideStatusDropdown.label = 'IOT Device  Status';
    this.rideStatusDropdown.key = 'id';
    this.rideStatusDropdown.displayKey = 'statusName';
    this.rideStatusDropdown.multiple=true

    this.historyStatusDropdown.label = 'Light Status';
    this.historyStatusDropdown.key = 'enum_id';
    this.historyStatusDropdown.displayKey = 'name';
  }

  getHistorytableDataByLockId(id) {
    let fd=  '2023-11-08'//
    this.datePipe.transform(
      this.today,
      'yyyy-MM-dd'
    );
    let td=this.datePipe.transform(
      this.today,
      'yyyy-MM-dd'
    );
    this.subsciption.push(
      this.reportService.getHistorytableDataByLockId(id,fd,td).subscribe((res) => {
        console.log(res);
        if (res.statusCode === 200) {
         this.tableData = res.data;
         console.log(this.tableData)
        } else {
          // this.toastr.warning(res.message);
        }
      })
    );
  }

  closemodel(){
    this.dialogRef.close(HistoryInfoComponent)

  }

  submit(){

  }

}
