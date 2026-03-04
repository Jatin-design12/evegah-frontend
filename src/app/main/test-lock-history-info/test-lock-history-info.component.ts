import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ClientEvegah, HistoryDropDownData } from 'src/app/core/constants/common-constant';
import { rowCountData, sortControlData } from 'src/app/core/constants/test-lock-constants';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { CommonService } from 'src/app/core/services/common.services';
import { ReportService } from 'src/app/core/services/report/report.service';

@Component({
  selector: 'app-test-lock-history-info',
  templateUrl: './test-lock-history-info.component.html',
  styleUrls: ['./test-lock-history-info.component.scss']
})
export class TestLockHistoryInfoComponent implements OnInit {


  cols: any = []
  tableData: any = []
  HistoryForm: FormGroup
  rideStatusDropdown = new Uiconfig();
  historyStatusDropdown = new Uiconfig();
  rowCountDropdown = new Uiconfig();
  sortControlDropdown = new Uiconfig();

  rideData = [
    {
      id: 0, name: 'speed', displayName: 'Speed'
    },
    {
      id: 1, name: 'latitude', displayName: 'Latitude'
    },
    {
      id: 2, name: 'longitude', displayName: 'Longitude'
    },
    {
      id: 3, name: 'battery', displayName: 'Battery %'
    }
  ];
  historyData = HistoryDropDownData;
  sortControlData = sortControlData;
  rowCountData = rowCountData;

  subsciption: Subscription[] = []
  today = new Date()
  selectAllRide: boolean = false

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<TestLockHistoryInfoComponent>,
    private commonService: CommonService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this.HistoryForm = this.fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      rideStatus: ['', [Validators.required]],
      historyStatus: ['', [Validators.required]],
      rowCount: ['', [Validators.required]],
      sort: ['', [Validators.required]]
    });

    this.setClientBasedTableColumns();
    this.setDefaultConfig()
    this.setValue()
    this.setClientBasedRideData();

    let fd = this.datePipe.transform(
      this.today,
      'yyyy-MM-dd'
    ); //'2023-11-08'
    let td = this.datePipe.transform(
      this.today,
      'yyyy-MM-dd'
    );
    // this.getHistoryRecords(fd, td);
  }

  setClientBasedTableColumns() {

    this.cols = [
      {
        key: 'sno',
        display: 'S.No.',
        sort: false,
        config: { isIndex: true },
      },
      {
        key: 'device_id',
        display: 'IOT Device  Number',
        sort: true,
        //config: { isDate: true, format: 'dd-MM-yyyy, h:mm:ss a' },
      },
      {
        key: 'ride_booking_no',
        display: 'Ride Booking Number',
        sort: true,
      },
      {
        key: 'lock_status',
        display: 'IOT Device  Status',
        sort: true,
      }
    ];

    let clientName = this.commonService.checkClientName();

    if (clientName === ClientEvegah) {
      const _columns = [
        {
          key: 'instruction_name',
          display: 'Device Instruction',
          sort: true,
        },
        {
          key: 'deveice_light_status',
          display: 'Light Status',
          sort: true,
        },
        {
          key: 'device_light_instruction',
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
          key: 'battery',
          display: 'Battery %',
          sort: true,
        },
        {
          key: 'internal_batt_v',
          display: 'Internal Battery Voltage',
          sort: true,
        },
        {
          key: 'external_batt_v',
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
          key: 'createdon_date',
          display: 'Created Date',
          sort: true,
          config: { isDate: true, format: 'dd-MM-yyyy , h:mm:ss a' }, //'dd-MM-yyyy, h:mm:ss a'
        }
      ];
      this.cols = [...this.cols, ..._columns];
    } else {
      const _columns = [
        {
          key: 'powerOnOffStatus',
          display: 'Power On/Off Status',
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
          key: 'battery',
          display: 'Battery %',
          sort: true,
        },
        {
          key: 'speed',
          display: 'Speed',
          sort: true,
        },
        {
          key: 'createdon_date',
          display: 'Created Date',
          sort: true,
          config: { isDate: true, format: 'dd-MM-yyyy , h:mm:ss a' }, //'dd-MM-yyyy, h:mm:ss a'
        }
      ];
      this.cols = [...this.cols, ..._columns];
    }
  }

  setClientBasedRideData() {
    let clientName = this.commonService.checkClientName();

    if (clientName == ClientEvegah) {
      const _rideData = [
        {
          id: 4, name: 'internal_batt_v', displayName: 'Internal Battery Voltage'
        },
        {
          id: 5, name: 'external_batt_v', displayName: 'External Battery Voltage'
        },
        {
          id: 6, name: 'altitude', displayName: 'Altitude'
        },
        {
          id: 7, name: 'deviceLightStatusEnumId', displayName: 'Device Light On/Off Status'
        },
        {
          id: 8, name: 'deviceLightInstructionEnumId', displayName: 'Device Light On/Off Instruction '
        },
        {
          id: 9, name: 'instructionId', displayName: 'InstructionId'
        },
        {
          id: 10, name: 'deviceLockAndUnlockStatus', displayName: 'Device LockAndUnlock Status'
        },
        {
          id: 11, name: 'beepStatusEnumId', displayName: 'Device Beep On/Off Status'
        },
        {
          id: 10, name: 'beepInstructionEnumId', displayName: 'Beep On/Off Instruction'
        },
      ];

      this.rideData = [...this.rideData, ..._rideData];

    } else {

      const _rideData = [
        {
          id: 4, name: 'deviceLockAndUnlockStatus', displayName: 'Device Lock And Unlock Status'
        },
        {
          id: 5, name: 'powerOnOffStatus', displayName: 'Power On Off Status'
        },
      ];

      this.rideData = [...this.rideData, ..._rideData];

    }
  }

  setValue() {
    this.HistoryForm.controls.fromDate.setValue(this.today);
    this.HistoryForm.controls.toDate.setValue(this.today);
    this.HistoryForm.controls.historyStatus.setValue('available');
    this.HistoryForm.controls.rowCount.setValue('10');
    this.HistoryForm.controls.sort.setValue('asce');


    let array = [
      "speed",
      "latitude",
      "longitude",
      "battery"
    ];

    let clientName = this.commonService.checkClientName();

    if (clientName == ClientEvegah) {
      const _array = [
        "internal_batt_v",
        "external_batt_v",
        "altitude",
        "deviceLightStatusEnumId",
        "deviceLightInstructionEnumId",
        "instructionId",
        "deviceLockAndUnlockStatus",
        "beepStatusEnumId",
        "beepInstructionEnumId"
      ];

      array = [...array, ..._array];
    } else {
      const _array = [
        "deviceLockAndUnlockStatus",
        "powerOnOffStatus"
      ];

      array = [...array, ..._array];
    }

    // this.HistoryForm.controls.rideStatus.setValue(array);
    this.selectAllRide = true;
  }

  setDefaultConfig() {
    //State
    this.rideStatusDropdown.label = 'Ride Status';
    this.rideStatusDropdown.key = 'name';
    this.rideStatusDropdown.displayKey = 'displayName';
    this.rideStatusDropdown.multiple = true

    this.historyStatusDropdown.label = 'History Data ';
    this.historyStatusDropdown.key = 'name';
    this.historyStatusDropdown.displayKey = 'displayName';

    this.rowCountDropdown.label = 'Row Count';
    this.rowCountDropdown.key = 'value';
    this.rowCountDropdown.displayKey = 'label';

    this.sortControlDropdown.label = 'Sorting';
    this.sortControlDropdown.key = 'value';
    this.sortControlDropdown.displayKey = 'label';
  }

  getHistorytableDataByLockId(id) {
    let fd = this.datePipe.transform(
      this.today,
      'yyyy-MM-dd'
    ); //'2023-11-08'
    let td = this.datePipe.transform(
      this.today,
      'yyyy-MM-dd'
    );
    this.subsciption.push(
      this.reportService.getHistorytableDataByLockId(id, fd, td).subscribe((res) => {
        if (res.statusCode === 200) {
          this.tableData = res.data;
        } else {
          // this.toastr.warning(res.message);
        }
      })
    );
  }

  closemodel() {
    this.dialogRef.close(TestLockHistoryInfoComponent)

  }

  getRideStatus(event) {
    console.log(event, "check")
  }

  submit() {
    if (this.HistoryForm.invalid) {
      this.HistoryForm.markAllAsTouched();
      return;
    }
    let fromDate = this.datePipe.transform(
      this.HistoryForm.value.fromDate,
      'yyyy-MM-dd'
    );
    let toDate = this.datePipe.transform(
      this.HistoryForm.value.toDate,
      'yyyy-MM-dd'
    );

    if (fromDate > toDate) {
      this.toastr.warning('From Date Can not be Greater than To Date.');
      return;
    }
    this.getHistoryRecords(fromDate, toDate)
  }

  getHistoryRecords(fromDate?: any, toDate?: any) {
    let value = this.HistoryForm.value
    let rideStatus = value.rideStatus
    let historyStatus = value.historyStatus

    this.tableData = []

    let obj = {
      lockId: this.data.lockId,
      fromDate: fromDate,
      toDate: toDate,
      rowCount: value.rowCount,
      sort: value.sort
    }

    rideStatus.forEach(e => {
      obj[e] = historyStatus
    })

    this.rideData.forEach(e => {
      if (obj[e.name] == undefined) {
        obj[e.name] = "not available"
      }
    })

    let clientName = this.commonService.checkClientName();
    this.spinner.show()
    this.subsciption.push(
      this.reportService.getHistryBtnData(obj, clientName).subscribe((res) => {
        console.log(res);
        if (res.statusCode === 200) {
          this.tableData = res.data;
          console.log(this.tableData)
          this.spinner.hide()
        } else {
          this.toastr.warning(res.message);
          this.spinner.hide()
        }
      },
      (err)=> this.spinner.hide()
      )
    );
  }

}

