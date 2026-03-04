import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IGetCityData } from 'src/app/core/interfaces/common/city-data';
import { IGetStateData } from 'src/app/core/interfaces/common/state-data';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AreaService } from 'src/app/core/services/master/area/area.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/core/services/common.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { VehicleModelService } from 'src/app/core/services/vehicle.service';
import { FarePlanService } from 'src/app/core/services/master/farePlan/fare-plan.service';
import { FarePlanModel } from 'src/app/core/models/master/farePlanModel';
import { ConfirmationModalComponent } from 'src/app/shared/components/components';
import { MatDialog } from '@angular/material/dialog';
import { LocalServiceService } from 'src/app/core/services/local-service.service';
import { DatePipe } from '@angular/common';
import { ZoneService } from 'src/app/core/services/zone.service';
import { AREATYPE, ActiveOrDeactive } from 'src/app/core/constants/common-constant';
import { ReportService } from 'src/app/core/services/report/report.service';

@Component({
  selector: 'app-fare-plan-master',
  templateUrl: './fare-plan-master.component.html',
  styleUrls: ['./fare-plan-master.component.scss'],
})
export class FarePlanMasterComponent implements OnInit, OnDestroy {
  heading: string = 'Create Fare Plan';
  farePlanMasterFrom: FormGroup;
  stateDropdown = new Uiconfig();
  cityDropdown = new Uiconfig();
  stateData: any[] = [];
  cityData: any[] = [];
  areaTypeDropdown = new Uiconfig();
  areaDropdown = new Uiconfig();
  vehicleTypeDropdown = new Uiconfig();
  bikeModelDropdown = new Uiconfig();
  areaTypeData: any = [
    // {
    //   id: 30,
    //   name: 'Open Area',
    // },
    // {
    //   id: 31,
    //   name: 'Close Area',
    // },
    //     30	"Area Type"	"Open"
    // 31	"Area Type"	"Close"
  ];
  addBtn: string = 'Add';
  areaData: any = [];
  vehicleTypeData: any = [];
  bikeModelData: any = [];
  isChecked: boolean = false;

  subscription: Subscription[] = [];
  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    public formBuilder: FormBuilder,
    public router: Router,
    private AreaService: AreaService,
    private VehicleModel: VehicleModelService,
    private spinner: NgxSpinnerService,
    private farePlanService: FarePlanService,
    private dailogRef: MatDialog,
    private storageService: LocalServiceService,
    private datePipe: DatePipe,
    private zoneService: ZoneService,
    private reportService:ReportService
  ) {}

  userData: any;
  fareData: any = {};

  ngOnInit(): void {
    this.setDefaultConfig();
    this.userData = JSON.parse(sessionStorage.getItem('user'));
    this.farePlanMasterFrom = this.formBuilder.group({
      stateId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      areaId: [],
      areaTypeId: ['', [Validators.required]],
      vehicleTypeId: [''],
      modelId: ['', [Validators.required]],
      hireTime: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^([[0-9]{1,2}){1}(.[0-9]{1,2})?$'),
        ],
      ],
      fromDate: [this.date, [Validators.required]],
      applyTime: ['', [Validators.required]],
      minRateMonday: [
        ,
        [
          Validators.min(0),
          Validators.pattern('^([0-9]{1,2}){1}(.[0-9]{1,2})?$'),
        ],
      ],
      minRateTuesday: [
        ,
        [
          Validators.min(0),
          Validators.pattern('^([0-9]{1,2}){1}(.[0-9]{1,2})?$'),
        ],
      ],
      minRateWednesday: [
        ,
        [
          Validators.min(0),
          Validators.pattern('^([0-9]{1,2}){1}(.[0-9]{1,2})?$'),
        ],
      ],
      minRateThursday: [
        ,
        [
          Validators.min(0),
          Validators.pattern('^([0-9]{1,2}){1}(.[0-9]{1,2})?$'),
        ],
      ],
      minRateFriday: [
        ,
        [
          Validators.min(0),
          Validators.pattern('^([0-9]{1,2}){1}(.[0-9]{1,2})?$'),
        ],
      ],
      minRateSaturday: [
        ,
        [
          Validators.min(0),
          Validators.pattern('^([0-9]{1,2}){1}(.[0-9]{1,2})?$'),
        ],
      ],
      minRateSunday: [
        ,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^([0-9]{1,2}){1}(.[0-9]{1,2})?$'),
        ],
      ],
    });

    this.getAllDropDownData();
    this.checkMode();
  }

  getAllDropDownData() {
    this.getState(0); // 0 for all state
    this.getVehicleTypeData();
    this.getAreaTypeOpen_Close()
  }
  setDefaultConfig() {
    // State Dropdown
    this.stateDropdown.label = 'State';
    this.stateDropdown.key = 'mapStateId';
    this.stateDropdown.displayKey = 'mapStateName';

    // city Dropdown
    this.cityDropdown.label = 'City';
    this.cityDropdown.key = 'mapCityId';
    this.cityDropdown.displayKey = 'mapCityName';

    //Area
    this.areaTypeDropdown.label = 'Select Area Type';
    this.areaTypeDropdown.key = 'enum_id',//'id';
    this.areaTypeDropdown.displayKey ='name';

    //Area Name
    this.areaDropdown.label = 'Select Area Name';
    this.areaDropdown.key = 'areaId';
    this.areaDropdown.displayKey = 'name';

    //vehicle Type
    this.vehicleTypeDropdown.label = 'Select vehicle Type';
    this.vehicleTypeDropdown.key = 'vehicleType';
    this.vehicleTypeDropdown.displayKey = 'vehicleTypeName';

    //Bike Model
    this.bikeModelDropdown.label = 'Select Vehicle Model';
    this.bikeModelDropdown.key = 'vehicleId';
    this.bikeModelDropdown.displayKey = 'modelName';
  }
  // back to list
  backButton() {
    this.router.navigate(['./main/master/fare-plan']);
  }

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

  getState(id) {
    this.spinner.show();
    // this.subscription.push(
    //   this.commonService.getStateList(101).subscribe((res) => {
    //     if (res.statusCode === 200) {
    //       this.stateData = res.data;
    //       this.spinner.hide();
    //       // this.getCity();
    //     } else {
    //       this.toastr.warning(res.message);
    //       this.spinner.hide();
    //     }
    //   })
    // );
    this.subscription.push(
      this.zoneService.getMapState(id).subscribe((res) => {
        if (res.statusCode === 200) {
          this.spinner.hide();
          this.stateData = res.data;
        } else {
          this.spinner.hide();
          // this.toastr.warning(res.message)
        }
      })
    );
    this.spinner.hide();
  }

  getCity(id) {
    this.cityData = [];
    this.areaData = [];
    // this.areaTypeData = [];
    this.getAreaTypeData();
    let stateId = this.farePlanMasterFrom.value.stateId;
    // this.subscription.push(
    //   this.commonService.getCityList(id).subscribe((res) => {
    //     if (res.statusCode === 200) {
    //       this.cityData = res.data;
    //       console.log(this.cityData, 'cityData');
    //     } else {
    //       this.toastr.warning(res.message);
    //     }
    //   })
    // );
    if (this.editMode || this.viewMode) stateId = id;

    console.log(stateId, 'stateId check');
    // stateId=undefined
    this.subscription.push(
      this.zoneService.getMapCity(stateId).subscribe((res) => {
        if (res.statusCode === 200) {
          this.cityData = res.data;
          // if (this.editData) {
          //     this.createZoneForm.controls.cityId.setValue((this.createZoneForm.value.cityId));
          // }
        } else {
          // this.toastr.warning(res.message);
        }
      })
    );
  }

  isAreaClosed: boolean = true;
  selectAreaType(e) {
    console.log(e, "areaType")
    //  areaType Dropdown change time invoke    e== areaType
    this.farePlanMasterFrom.controls.cityId.valueChanges.subscribe((res) => {
      this.areaDataName = [];
    });

    if (e == 30) {
      this.isAreaClosed = false;
      // this.farePlanMasterFrom.controls.areaId.disable();
    } else {
      this.isAreaClosed = true;

      // this.farePlanMasterFrom.controls.areaId.enable();
      this.areaData = [];
      this.areaDataName.forEach((el) => {
        if (e == el.areaTypeEnumId) {
          this.areaData.push(el);
        }
      });
      let cityId =this.farePlanMasterFrom.controls.cityId.value
      this.getAllAreaList(0, cityId,e);
    }
  }
  selectAreaName(e) {
    // city Dropdown change time invoke    e== cityId
    this.areaData = [];
    this.areaTypeData = [];
    this.getAreaTypeData();
    this.areaDataName = [];
    this.getAllAreaList(0, e,0);
    this.areaData = [...this.areaDataName];
  }

  areaDataName = [];
  getAllAreaList(areaId, cityId,areaTypeId) {
    this.areaDataName = [];
    this.spinner.show();
    this.subscription.push(
      this.zoneService.getAreaDetailOnMapZone(areaId, cityId,areaTypeId ).subscribe(
        (res) => {
          if (res.statusCode === 200) {
            this.areaDataName = res.data;
            this.spinner.hide();
            // this.toastr.success(res.message);
          } else if (res.statusCode == 422) {
            this.spinner.hide();
            if (!this.editMode && !this.viewMode) {
              this.toastr.warning('Area not Created Selected City');
            }
          } else {
            this.spinner.hide();
            // this.toastr.warning(res.message);
          }
        }
      )
    );
    // this.spinner.hide()
  }

  getVehicleTypeData() {
    this.vehicleTypeData = [];
    this.subscription.push(
      this.farePlanService.getvehicleTypeList().subscribe((res) => {
        if (res.statusCode === 200) {
          // this.vehicleTypeData = res.data;
          res.data.forEach((e) => {
            e.vehicleType = e.vehicle_type;
            e.vehicleTypeName = e.vehicle_type_name;
          });
          this.vehicleTypeData = res.data;
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  selectBikeModel(e) {
    this.getVehicleList(e);
  }

  // get vehicle list
  getVehicleList(e) {
    this.subscription.push(
      this.VehicleModel.getVehicleList().subscribe((res) => {
        if (res.statusCode === 200) {
          this.bikeModelData = res.data;
          // if(res.message === "Data is not available."){
          //   this.vehicleModel.push({modelName:"Data is not available."})

          // }
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  tableData: any = [];
  checkDuplicate() {
    const formValue = this.farePlanMasterFrom.value;

    this.tableData.forEach((e) => {
      e.formValue.fromDate = this.datePipe.transform(
        e.formValue.fromDate,
        'MM/dd/yyyy'
      );
      formValue.fromDate = this.datePipe.transform(
        formValue.fromDate,
        'MM/dd/yyyy'
      );
      const check = JSON.stringify(e.formValue) === JSON.stringify(formValue);
      if (check) {
        this.toastr.warning("Created FarePlan's already Added");
        // this.farePlanMasterFrom.reset()
        this.delete(e);
      } else {
      }
    });
  }

  add() {
    if (this.farePlanMasterFrom.invalid) {
      this.farePlanMasterFrom.markAllAsTouched();
      return;
    }
    this.checkDuplicate();
    const formValue = this.farePlanMasterFrom.value;

    if (formValue.fromDate == this.date) {
      let CurrentTime = new Date().getHours() + ':' + new Date().getMinutes(); //+ ':'+  new Date().getSeconds()
      console.log(CurrentTime);
      if (CurrentTime > formValue.applyTime) {
        this.toastr.warning('its past time Fare Plan not applicable time');
        return;
      }
    }

    let stateName = this.stateData.filter((e) => {
      if (e.mapStateId == formValue.stateId) return e;
    });
    let cityName = this.cityData.filter((e) => {
      if (e.mapCityId == formValue.cityId) return e;
    });
    let areaTypeName = this.areaTypeData.filter((e) => {
      if (e.enum_id == formValue.areaTypeId) return e;
    });
    let areaName = this.areaData.filter((e) => {
      if (e.areaId == formValue.areaId) return e;
    });

    let vehicleTypeName = this.vehicleTypeData.filter((e) => {
      if (e.vehicleType == formValue.vehicleTypeId) return e;
    });
    let bikeModelName = this.bikeModelData.filter((e) => {
      if (e.vehicleId == formValue.modelId) return e;
    });

    let i = this.tableData.length + 1;
    const obj = {
      id: i,
      isArea: this.isAreaClosed,
      stateName: stateName[0],
      cityName: cityName[0],
      areaTypeName: areaTypeName[0],
      areaName: areaName[0],
      vehicleTypeName: vehicleTypeName[0],
      bikeModelName: bikeModelName[0],
      aplicableDate: formValue.fromDate,
      minHireTime: formValue.hireTime,
      formValue: formValue,
      statusEnumId: 1,
      isAdd: true,
      IsChange: true,
      iseditModeNotEdit: true,
      isNewRecord: true,
      isUpdate: false,
      isCheck: true,
    };
    if (
      this.farePlanMasterFrom.value.minRateMonday > 0 &&
      this.farePlanMasterFrom.value.minRateTuesday > 0 &&
      this.farePlanMasterFrom.value.minRateWednesday > 0 &&
      this.farePlanMasterFrom.value.minRateThursday > 0 &&
      this.farePlanMasterFrom.value.minRateFriday > 0 &&
      this.farePlanMasterFrom.value.minRateSaturday > 0 &&
      this.farePlanMasterFrom.value.minRateSunday > 0
    ) {

      if (this.addBtn == 'Update') {
        this.tableData.forEach((e: any) => {
          if (e.isUpdate) {
            console.log(e);
            e.formValue.hireTime = formValue.hireTime;
            e.stateName = stateName[0];
            e.cityName = cityName[0];
            e.isArea = this.isAreaClosed;
            e.areaTypeName = areaTypeName[0];
            e.areaName = areaName[0];
            e.vehicleTypeName = vehicleTypeName[0];
            e.bikeModelName = bikeModelName[0];
            e.aplicableDate = formValue.fromDate;
            e.minHireTime = formValue.hireTime;
            e.formValue = formValue;
            (e.isUpdate = false),
              (e.IsChange = true),
              (e.statusEnumId = 1),
              (e.isCheck = true);
            console.log(this.farePlanMasterFrom.value);
          }
        });
      } else if (this.addBtn == 'Add') {
        console.log('else add');
        this.tableData.push(obj);
      }

      this.farePlanMasterFrom.reset();
    } else {
      const dialogRef = this.dailogRef.open(ConfirmationModalComponent, {
        data: {
          data: `Are you Sure About Min. Days Rate `,
          isFare: true,
          FormValue: this.farePlanMasterFrom.value,
        },
        height: '300px',
        width: '300px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        if (result) {
          // if yes click
          if (this.addBtn == 'Update') {
            this.tableData.forEach((e: any) => {
              if (e.isUpdate) {
                console.log(e);
                e.formValue.hireTime = formValue.hireTime;
                e.stateName = stateName[0];
                e.cityName = cityName[0];
                e.isArea = this.isAreaClosed;
                e.areaTypeName = areaTypeName[0];
                e.areaName = areaName[0];
                e.vehicleTypeName = vehicleTypeName[0];
                e.bikeModelName = bikeModelName[0];
                e.aplicableDate = formValue.fromDate;
                e.minHireTime = formValue.hireTime;
                e.formValue = formValue;
                e.isUpdate = true;
                (e.IsChange = true);
                  (e.statusEnumId = 1);
                  (e.isCheck = true);
              }
            });
            this.addBtn = 'Add';
            this.farePlanMasterFrom.reset();
          } else if (this.addBtn == 'Add') {
            this.tableData.forEach((e: any) => {
              if (e.isUpdate) {
                e.formValue.hireTime = formValue.hireTime;
                e.stateName = stateName[0];
                e.cityName = cityName[0];
                e.isArea = this.isAreaClosed;
                e.areaTypeName = areaTypeName[0];
                e.areaName = areaName[0];
                e.vehicleTypeName = vehicleTypeName[0];
                e.bikeModelName = bikeModelName[0];
                e.aplicableDate = formValue.fromDate;
                e.minHireTime = formValue.hireTime;
                e.formValue = formValue;
                e.isUpdate = true;
                e.IsChange = true;
                console.log(this.farePlanMasterFrom.value, 'if update me');
              }
            });

            if (obj.isNewRecord) {
              this.tableData.push(obj);
              this.farePlanMasterFrom.reset();
            }
            console.log(
              this.tableData,
              obj.isNewRecord,
              obj.isUpdate,
              'table data'
            );

            //
          }
        }
      });
    }
    // this.farePlanMasterFrom.reset();
    // this.addBtn = 'Add';
  }

  delete(row) {
    console.log(row);
    const index = this.tableData.findIndex((item) => item.id === row.id);
    console.log(index);
    this.tableData.splice(index, 1);
  }

  //editModeNotEdit:boolean=false // edit Button for editMode Disable if plan not valid
  async edit(e) {
    console.log(e, 'check for edit');
    let row = e.formValue;
    if (this.editMode) {
      this.selectBikeModel(row.vehicleTypeId);
      this.selectAreaType(row.areaTypeId);
    }
    this.addBtn = 'Update';
    e.isUpdate = true;
    e.isNewRecord = false;
    this.farePlanMasterFrom.controls.hireTime.setValue(row.hireTime);
    this.farePlanMasterFrom.controls.stateId.setValue(row.stateId);
    this.farePlanMasterFrom.controls.cityId.setValue(row.cityId);
    this.farePlanMasterFrom.controls.fromDate.setValue(new Date(row.fromDate));
    this.farePlanMasterFrom.controls.areaId.setValue(row.areaId);
    this.farePlanMasterFrom.controls.areaTypeId.setValue(
      Number(row.areaTypeId)
    );
    this.farePlanMasterFrom.controls.modelId.setValue(row.modelId);
    this.farePlanMasterFrom.controls.vehicleTypeId.setValue(row.vehicleTypeId);
    this.farePlanMasterFrom.controls.minRateMonday.setValue(row.minRateMonday);
    this.farePlanMasterFrom.controls.minRateTuesday.setValue(
      row.minRateTuesday
    );
    this.farePlanMasterFrom.controls.minRateThursday.setValue(
      row.minRateThursday
    );
    this.farePlanMasterFrom.controls.minRateWednesday.setValue(
      row.minRateWednesday
    );
    this.farePlanMasterFrom.controls.minRateFriday.setValue(row.minRateFriday);
    this.farePlanMasterFrom.controls.minRateSaturday.setValue(
      row.minRateSaturday
    );
    this.farePlanMasterFrom.controls.minRateSunday.setValue(row.minRateSunday);
    this.farePlanMasterFrom.controls.applyTime.setValue(row.applyTime);

    // this.farePlanMasterFrom.setValue(row.formValue)
  }

  // farePlanModel = new FarePlanModel();
  farePlanModel = [];
  date = new Date();
  combineDateAndTime(date, time) {
    date = new Date(date);
    let string = time.split(':');
    let timeString = string[0] + ':' + string[1] + ':00';
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Jan is 0, dec is 11
    var day = date.getDate();
    var dateString = '' + year + '-' + month + '-' + day;
    var combined = new Date(dateString + ' ' + timeString);

    return combined;
  }

  saveFarePlan() {
    let data: any = [];
    this.tableData.forEach((e, i) => {
      let combineDate = this.combineDateAndTime(
        e.formValue.fromDate,
        e.formValue.applyTime
      );
      let obj = {
        rownumber: i + 1,
        farePlanId: 0,
        stateId: e.formValue.stateId,
        cityId: e.formValue.cityId,
        mapCityId: e.formValue.cityId,
        areaTypeEnumId: e.formValue.areaTypeId,
        areaId: e.formValue.areaId || 0,
        modelId: e.formValue.modelId, // modelId hai
        vehicleId: e.formValue.vehicleId,
        aplicableDate: combineDate, //e.formValue.fromDate,
        hireTimeInMinuts: Number(e.formValue.hireTime),
        perMinuteRateMonday: Number(e.formValue.minRateMonday),
        perMinuteRateTuesday: Number(e.formValue.minRateTuesday),
        perMinuteRateWednesday: Number(e.formValue.minRateWednesday),
        perMinuteRateThursday: Number(e.formValue.minRateThursday),
        perMinuteRateFriday: Number(e.formValue.minRateFriday),
        perMinuteRateSaturday: Number(e.formValue.minRateSaturday),
        perMinuteRateSunday: Number(e.formValue.minRateSunday),
        statusEnumId: e.statusEnumId || 1,
        createdonDate: this.date,
        createdyId: this.userData.id, // adminId
        actionsType: 'insert',
      };
      if (this.editMode) {
        obj.farePlanId = e.fareId || 0;
        obj.actionsType = 'update';
        if (obj.statusEnumId == 2) {
          obj.actionsType = ActiveOrDeactive; //'activeOrDeactive'//'activeAndDeactive';
        } else if (e.actionsActive == 'Active') {
          obj.actionsType = ActiveOrDeactive;
        }

        if (obj.farePlanId == 0) {
          obj.actionsType = 'insert';
          obj.statusEnumId = 1;
        }
      }

      if (e.IsChange) {
        data.push(obj);
      }
    });
    this.farePlanModel = [...data];
    if (this.farePlanModel.length == 0) {
      console.log(this.farePlanModel, 'check');
      this.backButton();
      return;
    }
    this.subscription.push(
      this.farePlanService
        .addUpdateFarePlan(this.farePlanModel) //
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.toastr.success(res.message);
            this.backButton();
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }

  editMode: boolean = false;
  viewMode: boolean = false;

  checkMode() {
    let data = this.storageService.getDataSession('farePlan') || '';
    if (data == '') {
      return;
    }
    this.fareData = JSON.parse(this.storageService.getDataSession('farePlan'));
    if (this.fareData !== null) {
      if (this.fareData.mode === 'edit') {
        this.editMode = true;
        this.heading =
          'Edit Fare Plan:  ' +
          this.fareData.stateName +
          ',' +
          this.fareData.mapCityName;
        this.getListFarePlan(this.fareData.mapCityId);
      } else {
        this.viewMode = true;
        this.heading =
          'View Fare Plan : ' +
          this.fareData.stateName +
          ',' +
          this.fareData.mapCityName;
        // this.tableData = [...this.fareData]
        this.getListFarePlan(this.fareData.mapCityId);
      }
    }
  }

  checkTime(e) {
    console.log(e);
  }

  // Active Deactive row when edit mode
  isActive(row) {
    if (row.isCheck == true) {
      row.statusEnumId = 2; // active
      row.actionsActive = 'DA';
    } else if (row.isCheck == false) {
      row.actionsActive = 'Active';

      row.statusEnumId = 1; // deactive
    }
    row.IsChange = true;
  }

  // get farePlan Data
  farePlanModeData: any = [];
  getListFarePlan(cityId) {
    this.subscription.push(
      this.farePlanService
        .getAlllistFarePlan(0, cityId, 0, 0, 0)
        .subscribe((res) => {
          if (res.statusCode == 200) {
            this.farePlanModeData = res.data;
            if (this.viewMode) {
              this.tableData = [...this.farePlanModeData];
            } else if (this.editMode) {
              this.farePlanModeData.forEach((e, i) => {
                console.log(e, 'edit mode checj');
                // this.getState(e.stateId)
                console.log(e.stateId, 'e.stateId check city', e.stateId);
                this.getCity(e.stateId);
                // this.getAllAreaList(0, e.cityId);
                this.selectAreaName(e.mapCityId);
                // this.getTime(e.aplicableDate)
                this.compareDateForEditButton(e.aplicableDate);
                const formValue = {
                  fromDate: new Date(e.aplicableDate),
                  hireTime: e.hireTimeInMinuts,
                  minRateMonday: e.perMinuteRateMonday,
                  minRateTuesday: e.perMinuteRateTuesday,
                  minRateWednesday: e.perMinuteRateWednesday,
                  minRateThursday: e.perMinuteRateThursday,
                  minRateFriday: e.perMinuteRateFriday,
                  minRateSaturday: e.perMinuteRateSaturday,
                  minRateSunday: e.perMinuteRateSunday,
                  // statusEnumId: e.statusEnumId,
                  stateId: String(e.stateId),
                  cityId: String(e.mapCityId),
                  areaId: e.areaId,
                  areaTypeId: e.areaTypeEnumId,
                  modelId: String(e.modeleId),
                  vehicleTypeId: String(e.vehicleType),
                  applyTime: this.getTime(e.aplicableDate),
                };
                const stateName = {
                  state_name: e.stateName,
                  state_id: e.stateId,
                };
                const cityName = {
                  city_name: e.mapCityName,
                  city_id: e.mapCityId,
                };
                const areaTypeName = {
                  name: e.areaType,
                };
                const areaName = {
                  name: e.areaName,
                };

                const vehicleTypeName = {
                  vehicleTypeName: e.vehicleTypeName,
                };
                const bikeModelName = {
                  modelName: e.modeleName,
                };

                const finalObj = {
                  rownumber: i + 1,
                  formValue: formValue,
                  stateName: stateName,
                  cityName: cityName,
                  mapCityName: cityName,
                  areaTypeName: areaTypeName,
                  areaName: areaName,
                  vehicleTypeName: vehicleTypeName,
                  bikeModelName: bikeModelName,
                  isCheck: e.statusEnumId == 1 ? true : false,
                  fareId: e.farePlanId,
                  IsChange: false,
                  iseditModeNotEdit: this.compareDateForEditButton(
                    e.aplicableDate
                  ),
                  isAlwayDeactive: this.compareDateForEditButton(
                    e.aplicableDate
                  ),
                  isArea: true,
                  statusEnumId: e.statusEnumId,
                };
                // const finalObj= {... formValue,...stateName,...cityName}
                this.tableData.push(finalObj);
              });
            }

            // this.toastr.success(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }

  compareDateForEditButton(date) {
    let currentDate = this.datePipe.transform(this.date, 'DD/MM/yyyy');
    let aplicableDate = this.datePipe.transform(date, 'DD/MM/yyyy');
    const x = new Date();
    const y = new Date(date);

    if (x < y) {
      return true;
    } else {
      return false;
    }
  }

  checkHire() {}

  getTime(date) {
    let newTime = this.datePipe.transform(date, 'hh:mm');
    return newTime;
  }

  getAreaTypeData() {
    this.areaTypeData = [];
    this.getAreaTypeOpen_Close()
  }

  

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
    this.storageService.removeDataSession('farePlan');
  }
}
