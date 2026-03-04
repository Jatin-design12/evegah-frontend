import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  BEEPBUTTON,
  DATE_TIME_FORMAT,
  DeviceBeepStatus,
  DeviceLightInstruction,
  HISTORY,
  LIGHTBUTTON,
  LOCATEBUTTON,
  LOCKBUTTON,
  offLIGHTBUTTON,
  onLIGHTBUTTON,
} from 'src/app/core/constants/common-constant';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { ReportService } from 'src/app/core/services/report/report.service';

@Component({
  selector: 'app-test-lock',
  templateUrl: './test-lock.component.html',
  styleUrls: ['./test-lock.component.scss'],
})
export class TestLockComponent implements OnInit {
  lockForm: FormGroup;
  heading: string;
  rideStatusDropdown = new Uiconfig();
  lightStatusDropdown = new Uiconfig();
  beepStatusDropdown = new Uiconfig();

  detailedRideList = [];
  cols = [];
  enumData: any = [];
  subsciption: Subscription[] = [];
  tableData: any = [];
  lightData: any = [];
  beepData:any=[]
  constructor(
    public formBuilder: FormBuilder,
    private reportService: ReportService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getlockUnlockList();
    this.getlightList();
    this.getBeepList()
    this.lockForm = this.formBuilder.group({
      name: [''],
      enumId: [0, [Validators.required]],
      lightId: [0, [Validators.required]],
      beepId:[0, [Validators.required]]
    });
    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'actionBTN',
        display: 'Action',
        sort: false,
        config: {
          isbutton: true,
          isClickAble: true,
          actions: [HISTORY,LOCATEBUTTON,LOCKBUTTON, LIGHTBUTTON, BEEPBUTTON,],
        },
      },
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
        display: 'IOT Device iD',
        sort: true,
        //config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },

      {
        key: 'lockStatus',
        display: 'IOT Device Status',
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
        key: 'beepStatusName',
        display: 'Beep Status',
        sort: true,
      },

      {
        key: 'beepInstructionName',
        display: 'Beep Instruction',
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

      // {
      //   key: 'deviceState',
      //   display: 'Deveice State',
      //   sort: true,
      // },
      {
        key: 'allotmentStatus',
        display: 'Allotment Status',
        sort: true,
      },
      {
        key: 'lockIMEINumber',
        display: 'IOT Device  IMEI No.',
        sort: true,
      },
      {
        key: 'deveiceStatus',
        display: 'Device Status',
        sort: true,
      },
      {
        key: 'lastdateforlockunlock',
        display: 'Last Update for lock/unlock',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'lastdateforlightonoff',
        display: 'Last Update for Light on/off',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'lastupdateddateforbeeponoff',
        display: 'Last Update for Beep on/off',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'lastdateforlatlong',
        display: 'Last Update for lat/lng',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      
      {
        key: 'lastdateforbatterypercentage',
        display: 'Last Update for Battery %',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'lastdateforexternalbatteryvolt',
        display: 'Last Update for External Battery volt.',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'lastdateforinternalbatteryvolt',
        display: 'Last Update for Internal Battery volt.',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      
      
      {
        key: 'lastdateforspeed',
        display: 'Last Update for Speed',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      {
        key: 'lastdateforaltitude',
        display: 'Last Update for Altitude',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }
      },
      
      

      {
        key: 'createdonDate',
        display: 'Created Date',
        sort: true,
        config: { isDate: true, format: DATE_TIME_FORMAT }, //'dd-MM-yyyy, h:mm:ss a'
      },
    ];
    this.setDefaultConfig();
    // this.getEnumList()/
  }
  setDefaultConfig() {
    //State
    this.rideStatusDropdown.label = 'IOT Device Status';
    this.rideStatusDropdown.key = 'id';
    this.rideStatusDropdown.displayKey = 'statusName';

    this.lightStatusDropdown.label = 'Light Status';
    this.lightStatusDropdown.key = 'enum_id';
    this.lightStatusDropdown.displayKey = 'name';

    this.beepStatusDropdown.label = 'Beep Status';
    this.beepStatusDropdown.key = 'enum_id';
    this.beepStatusDropdown.displayKey = 'name';
  }

  getlockUnlockList() {
    this.subsciption.push(
      this.reportService.GetlockUnclockStatus().subscribe((res) => {
        console.log(res);
        if (res.statusCode === 200) {
          let array = res.data;
          let obj = {
            id: 0,
            statusName: 'All',
          };
          array.unshift(obj);
          this.enumData = array;
        } else {
          // this.toastr.warning(res.message);
        }
      })
    );
  }

  getlightList() {
    this.subsciption.push(
      this.reportService
        .GetEnumDetails(DeviceLightInstruction)
        .subscribe((res) => {
          console.log(res);
          if (res.statusCode === 200) {
            let array = res.data;
            let obj = {
              enum_id: 0,
              name: 'All',
            };
            array.unshift(obj);
            this.lightData = array;
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );
  }

  getBeepList() {
    this.subsciption.push(
      this.reportService
        .GetEnumDetails(DeviceBeepStatus)
        .subscribe((res) => {
          console.log(res);
          if (res.statusCode === 200) {
            let array = res.data;
            let obj = {
              enum_id: 0,
              name: 'All',
            };
            array.unshift(obj);
            this.beepData = array;
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );
  }

  getlistBySearch() {
    this.tableData = [];
    let lockName = this.lockForm.value.name;
    let lock_unlockStatusId = this.lockForm.value.enumId | 0;
    let EnumId = this.lockForm.value.lightId;
    let beepStatusId = this.lockForm.value.beepId
    this.spinner.show();
    this.subsciption.push(
      this.reportService
        .getTestLockDetail(lockName, lock_unlockStatusId, EnumId,beepStatusId)
        .subscribe((res) => {
          console.log(res);
          if (res.statusCode === 200) {
            this.spinner.hide();
            res.data.forEach((element) => {
              element.locationData = true;

              element.device_lock_and_unlock_status =
                element.deviceLockAndUnlockStatus;
              element.device_lock_unlock_status = element.lockStatus;
            });
            this.tableData = res.data;
          } else {
            this.spinner.hide();
            // this.toastr.warning(res.message);
          }
        })
    );
  }

  submit() {
    if (this.lockForm.invalid) {
      this.lockForm.markAllAsTouched();
      return;
    }
    this.getlistBySearch();
  }
}
