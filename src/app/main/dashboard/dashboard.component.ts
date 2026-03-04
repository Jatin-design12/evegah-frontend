import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ZoneService } from 'src/app/core/services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { DATE_TIME_FORMAT,  } from 'src/app/core/constants/common-constant';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  NgZone,
} from '@angular/core';
import { ProduceBikeService } from 'src/app/core/services/produceBike/produceBike.service';
import { setInstruction } from 'src/app/core/services/setInstruction/setinstructionLockAndUnlock.service';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { IvyParser } from '@angular/compiler';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { setMinimumWalletBalance } from 'src/app/core/services/setUserMinimumBalance/setuserMinIBala.service';
import {
  LOCATEBUTTON,
  LOCKBUTTON,
  ENDBUTTON,
  UNLOCKBUTTON,
  MAINTENANCE,
  AVAILABLE,
  LIGHTBUTTON,
  BEEPBUTTON,
  ClientEvegah,
  Active,
  Available,
  UnderMaintenance,
  CLEAR_LOCK_INSTRUCTIONS,
  CLEAR_LIGHT_INSTRUCTIONS,
  HISTORY,
  ClientMetro,
  POWER_ON_OFF,
} from 'src/app/core/constants/common-constant';
import { BatteryService } from 'src/app/core/services/bikeBattery/battery.service';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IMapSearch } from 'src/app/core/interfaces/dashboard/map-search';
import { CommonService } from 'src/app/core/services/common.services';
import { environment } from 'src/environments/environment';
import { enumCodeConstants } from 'src/app/core/constants/enum-code-constants';
import { WithdrawService } from 'src/app/core/services/userTransaction/withdrawTransaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // ngAfterViewInit(){
  //   setInterval(() => {
  //     this.getBikeProduceDetails();
  //   }, 10000);
  // }
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  map: any;
  // withdrawInPending = [];
  subscription: Subscription[] = [];
  zoneForm: FormGroup;
  DashboardCard: any = [];
  lat;
  lng;
  activeLat;
  activeLng;
  zoneData = [];
  eveghaZoneMarkers: any = [];
  zoom: number = 15;
  selectZone = [];
  zone = new Uiconfig();
  private geoCoder;
  latitude: number;
  longitude: number;
  activeLocationLatLng: any = [];
  activeBikeLocationLatLng: any = [];
  @ViewChild('search')
  public searchElementRef: ElementRef;
  address: string;
  panelOpenState: boolean = false;
  searchText: string;
  BikeProduceDetailsList = [];
  requestedToLockUnlock = [];
  totalUpdationInminBall = []; ///
  cols; ///
  batterycols; ///
  batteryColData = [];
  geoFencingList = [];
  availableBikeCols = [];
  geoFencingBikeCols = [];
  batteryRideTableHide: boolean = false;
  activeRideTableHide: boolean = false;
  geoFencingTableHide: boolean = false;
  stationaryBikeTableHide: boolean = false;
  // activeWidthdrawTableHide: boolean = false;
  stationaryBikeList = [];
  stationaryBikeCols = [];
  // pendingWithdrawCols = [] ;
  card: any = '';
  mapSearch: IMapSearch;
  clientName = environment.clientName;
  metroClientName = ClientMetro;

  constructor(
    private ngZone: NgZone,
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private zoneService: ZoneService,
    private userServices: UserService,
    public zoneServices: ZoneService,
    public ProduceBikeService: ProduceBikeService,
    public setInstructionService: setInstruction,
    public activatedRoute: ActivatedRoute,
    public MinimumWalletBalances: setMinimumWalletBalance,
    public batteryService: BatteryService,
    private dashboardService: DashboardService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private  withdrawService :WithdrawService
  ) { }

  intervals: any;
  ngOnInit(): void {
    // this.pendingWithdrawCols.push(
    //   {
    //     key: 'ids',
    //     display: 'Sr.No.',
    //     sort: false,
    //     config: { isIndex: true },
    //   },
    //   {
    //     key: 'userName',
    //     display: 'User Name',
    //     sort: true,
    //   },
    //   {
    //     key: 'walletAmount',
    //     display: 'Wallet Amount',
    //     sort: true,
    //   },
    //   {
    //     key: 'withdrawRequestStatus',
    //     display: 'Withdraw Request Status',
    //     sort: true,
    //   },
    //   {
    //     key: 'depositAmount',
    //     display: 'Deposit Amount',
    //     sort: true,
    //   },
    //   {
    //     key: 'amount',
    //     display: 'Amount',
    //     sort: true,
    //   },
    //   {
    //     key: 'createdOnDate',
    //     display: 'Requested Date',
    //     sort: true,
    //     config: { isDate: true, format:DATE_TIME_FORMAT }
    //   }
    // );

  
    this.metroClientName = ClientMetro;

    // this.activatedRoute.queryParams.subscribe(params => {
    //   if(params){
    //     JSON.parse(params.data).data.rideStartLongitude = 22.6777004;
    //     this.zoom = 20;
    //     JSON.parse(params.data).data.rideStartLatitude = 75.8258323;
    //     this.activeLocationLatLng.push(JSON.parse(params.data).data)
    //   }

    // });

    this.getDashboardCard();

    this.intervals = setInterval(() => {
      this.getDashboardCard();
    }, 5000);

    this.getAdminCurrentLocation();
    // this.zonelist();
    // this.getBikeProduceDetails();
    this.zoneForm = this.formBuilder.group({
      zoneId: [''],
    });
  }

  getMinimumWalletBals() {
    this.totalUpdationInminBall = [];
    this.subscription.push(
      this.MinimumWalletBalances.getMinimumWalletBal().subscribe((res) => {
        if (res.statusCode === 200) {
          res.data.forEach((element) => {
            element.locationData = true;
          });
          this.totalUpdationInminBall = res.data;
        } else if (res.statusCode === 422) {
          this.toastr.warning(res.message);
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  rideBookList() {
    this.cols = [];
    this.activeRideTableHide = true;
    this.AvailableRideTableHide = false;
    this.batteryRideTableHide = false;
    this.maintenceRideTableHide = false;
    this.geoFencingTableHide = false;
    // this.activeWidthdrawTableHide = true;
    // this.withdrawUserListForPending(0,0,10)
    this.cols.push(
      {
        key: 'id',
        display: 'Sr.No.',
        sort: false,
        config: { isIndex: true },
      }
    )

    this.cols.push(
      {
        key: 'userName',
        display: 'User Name',
        sort: true,
      },)
    this.cols.push({
      key: 'mobileNumber',
      display: 'Mobile No.',
      sort: true,
    },
    )
    this.cols.push({
      key: 'bikeName',
      display: 'Vehicle ID',
      sort: true,
    },
    )
    this.cols.push({
      key: 'rideBookingNo',
      display: 'Ride Booking No',
      sort: true,
    })
    this.cols.push({
      key: 'fromRideTime',
      display: 'Ride Start Time',
      sort: true,
      config: { isTime: true, format: 'shortTime' },
    }
    )

    this.cols.push({
      key: 'lockNumber', //lockId
      display: 'IOT Device ID',
      sort: true,
    })
    this.cols.push({
      key: 'deveiceStatus',
      display: 'Device Status',
      sort: true,
    })
    this.cols.push({
      key: 'zoneName',
      display: 'Zone',
      sort: true,
    })
    this.cols.push({
      key: 'geoFenceInOut',
      display: 'Geo Fence Status',
      sort: true,
    })
    this.cols.push({
      key: 'device_lock_unlock_status',
      display: 'Device Locking Status',
      sort: true,
    })
    this.cols.push({
      key: 'instructionName',
      display: 'IOT Device Instruction Name',
      sort: true,
    })

    this.checkClientRequireColumn(this.cols, Active)
    this.cols.push({
      key: 'deviceLastRequestTime',
      display: 'Last Requested Time',
      config: { isDate: true, format: 'dd-MM-yyyy, h:mm a' },
    })
    this.cols.push({
      key: 'batteryPercentage',
      display: 'Battery %',
      sort: true,
    },
      {
        key: 'externalBattV',
        display: 'External Battery Voltage',
        sort: true,
      })

    this.cols.push({
      key: 'bikeProduceIds',
      display: 'Action',
      sort: false,
      config: {
        actions: [
          ENDBUTTON,
          LOCATEBUTTON,
          LOCKBUTTON,
          // LIGHTBUTTON,
          // BEEPBUTTON,
        ],
        isbutton: true,
        isClickAble: true,
      },
    },)

    this.checkClientRequiredActions(this.cols, Active)

    this.getActiveBookRide();
  }

  checkClientRequiredActions(data, callForm) {
    let clientName = this.commonService.checkClientName();

    if (clientName == ClientEvegah) {
      let index = data.find(e => e.display == 'Action')
      let lastIndex = index.config.actions.length
      let action = index.config.actions.splice(lastIndex, 0, "Light", 'Beep', CLEAR_LOCK_INSTRUCTIONS, CLEAR_LIGHT_INSTRUCTIONS, HISTORY)
    } else {
      let index = data.find(e => e.display == 'Action')
      let lastIndex = index.config.actions.length
      let action = index.config.actions.splice(lastIndex, 0, POWER_ON_OFF, HISTORY);
    }
  }

  checkClientRequireColumn(data, callFrom) {
    let clientName = this.commonService.checkClientName()

    if (clientName == ClientEvegah) {

      data.push({
        key: 'deviceLightStatus',
        display: 'light Status',
        sort: true,
      })

      data.push({
        key: 'deviceLightInstruction',
        display: 'Light Instruction Name',
        sort: true,
      })
      data.push({
        key: 'beepStatusName',
        display: 'Beep Status',
        sort: true,
      })
      data.push({
        key: 'beepInstructionName',
        display: 'Beep Instruction Name',
        sort: true,
      }
      )
    } else {

      data.push({
        key: 'powerOnOffStatus',
        display: 'Power Status',
        sort: true,
      });

    }

  }

  getActiveBookRide() {
    const obj = {
      mapCityName: '',
      mapStateName: '',
      mapCountryName: '',
    };
    this.subscription.push(
      this.ProduceBikeService.getActiveBookBikeDetails(obj).subscribe((res) => {
        if (res.statusCode === 200) {
          console.log(res.data);
          this.BikeProduceDetailsList = res.data;
          res.data.forEach((element) => {
            element.locationData = true;
          });

          this.totalUpdationInminBall = res.data;
          //this.BikeProduceDetailsList.push( res.data.find(e => e.allotmentStatusName === 'Allocated'))
        } else if (res.statusCode === 422) {
          this.toastr.warning(res.message);
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  batteryData(call, per) {
    this.activeRideTableHide = false;
    this.AvailableRideTableHide = false;
    this.batteryRideTableHide = true;
    this.maintenceRideTableHide = false;
    this.geoFencingTableHide = false;


    this.batterycols = []
    this.batterycols.push(
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
        key: 'mobile',
        display: 'Mobile No.',
        sort: true,
      },
      {
        key: 'bikeName',
        display: 'Vehicle ID',
        sort: true,
      },
      {
        key: 'batteryPercentage',
        display: 'Battery %',
        sort: true,
      },
      {
        key: 'externalBattV',
        display: 'External Battery Voltage',
        sort: true,
      },
      {
        key: 'internalBattV', //externalBattV
        display: 'Internal Battery Voltage',
        sort: true,
      },
      {
        key: 'lockNumber',
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
        display: 'IOT Device Instruction Name',
        sort: true,
      },
    )

    this.checkClientRequireColumn(this.batterycols, 'Battery')

    this.batterycols.push(
      {
        key: 'bikeBookedStatusName',
        display: 'Ride Status',
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
        key: 'bikeProduceIds',
        display: 'Action',
        sort: false,
        config: {
          actions: [LOCATEBUTTON, LOCKBUTTON,
            //  LIGHTBUTTON, BEEPBUTTON
          ],
          isbutton: true,
          isClickAble: true,
        },
      },
    )
    this.checkClientRequiredActions(this.batterycols, 'Battery')

    this.batteryPercentageData(call, per);
  }

  bikeBatteryStatusLessThenTwenty = [];
  produceBikeBatteryStatusGraterThenTwentyAndLessThenFifty = [];
  produceBikeBatteryStatusGraterThenFifty = [];
  batteryStatusData = [];
  batteryStatus: any = '';

  batteryPercentageData(call, per) {
    console.log(call);
    let batteryPercentage = per;
    this.batteryStatusData = [];
    const obj = {
      mapCityName: '',
      mapStateName: '',
      mapCountryName: '',
    };
    this.subscription.push(
      this.batteryService
        .BatteryPercentageApis(batteryPercentage, obj)
        .subscribe((res) => {
          if (res.statusCode === 200) {
            console.log(res);

            switch (call) {
              case 'lessTwenty':
                this.batteryStatus = '0 - 20%';
                res.data.forEach((element) => {
                  if (Number(element.bikeBookedStatus) === 14) {
                    element.locationData = true; //false
                    element.beepStatusName = element.beepStatusEnumName
                    element.beepInstructionName = element.beepInstructionEnumName
                  } else {
                    element.locationData = true;
                    element.beepStatusName = element.beepStatusEnumName
                    element.beepInstructionName = element.beepInstructionEnumName
                  }
                });

                this.batteryStatusData = [...res.data];
                break;

              case 'bwTwentyFifty':
                this.batteryStatus = '21% - 50%';

                res.data.forEach((element) => {
                  if (Number(element.bikeBookedStatus) === 14) {
                    element.locationData = true; //false
                    element.beepStatusName = element.beepStatusEnumName
                    element.beepInstructionName = element.beepInstructionEnumName
                  } else {
                    element.locationData = true;
                    element.beepStatusName = element.beepStatusEnumName
                    element.beepInstructionName = element.beepInstructionEnumName
                  }
                });
                this.batteryStatusData = [...res.data];
                break;

              case 'aboveFifty':
                this.batteryStatus = '51% - 100%';

                res.data.forEach((element) => {
                  if (Number(element.bikeBookedStatus) === 14) {
                    element.locationData = true; //false
                    element.beepStatusName = element.beepStatusEnumName
                    element.beepInstructionName = element.beepInstructionEnumName
                  } else {
                    element.locationData = true;
                    element.beepStatusName = element.beepStatusEnumName
                    element.beepInstructionName = element.beepInstructionEnumName
                  }
                });
                this.batteryStatusData = [...res.data];

                break;
            }

            //  this.bikeBatteryStatusLessThenTwenty = res.data[0].bikeBatteryStatusLessThenTwenty;
            //  this.produceBikeBatteryStatusGraterThenTwentyAndLessThenFifty =res.data[0].produceBikeBatteryStatusGraterThenTwentyAndLessThenFifty
            //  this.produceBikeBatteryStatusGraterThenFifty = res.data[0].produceBikeBatteryStatusGraterThenFifty
          }
        })
    );
  }

  getDashboardCard() {
    this.subscription.push(
      this.userServices.getDashboardCard().subscribe((res: any) => {
        if (res.statusCode === 200) {
          res.data[0].totalEarning = Math.round(res.data[0].totalEarning);
          this.DashboardCard = res.data[0];
          // console.log(this.DashboardCard, 'this.DashboardCard ');
        }
      })
    );
  }

  getAdminCurrentLocation() {
    //show current positin of user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  //api start
  zonelist() {
    this.subscription.push(
      this.zoneServices.zoneDetails().subscribe((res) => {
        if (res.statusCode === 200) {
          this.zoneData = res.data;

          this.zoneData.forEach((element) => {
            this.getZoneDetails(element.zoneid);
          });
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  getZoneDetails(zoneid) {
    this.subscription.push(
      this.zoneServices.getZoneDetail(zoneid, 0).subscribe((res) => {
        if (res.statusCode === 200) {
          res.data.forEach((element) => {
            this.eveghaZoneMarkers.push({
              title: element.name,
              latitude: element.latitude,
              longitude: element.longitude,
              name: element.name,
              id: element.id,
            });
          });
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  getBikeProduceDetails() {
    this.subscription.push(
      this.ProduceBikeService.getBikeProduceDetails().subscribe((res) => {
        if (res.statusCode === 200) {
          console.log(res.data);
          this.BikeProduceDetailsList = res.data;
          res.data.forEach((element) => {
            element.locationData = true;
          });

          this.totalUpdationInminBall = res.data;
          //this.BikeProduceDetailsList.push( res.data.find(e => e.allotmentStatusName === 'Allocated'))
        } else if (res.statusCode === 422) {
          this.toastr.warning(res.message);
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  setInstruction(bike, event) {
    if (event === 'lock') {
      // this.setInstructionapi(bike.lockNumber,2)
      this.setInstructionapi(bike.lockNumber, 3);
    } else {
      //this.setInstructionapi(bike.lockNumber,3)
      this.setInstructionapi(bike.lockNumber, 2);
    }
  }

  setInstructionapi(deviceid, instructionid) {
    this.subscription.push(
      this.setInstructionService
        .setInstructionToLockUnlock(deviceid, instructionid)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.toastr.success(res.message);
          } else if (res.statusCode === 422) {
            this.toastr.warning(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        })
    );
  }

  getUpdatedBikeProduceDetails(deviceid) {
    this.subscription.push(
      this.ProduceBikeService.getBikeProduceDetails().subscribe((res) => {
        if (res.statusCode === 200) {
          this.BikeProduceDetailsList.forEach((element) => {
            if (element.lockNumber === deviceid) {
              const exists = this.requestedToLockUnlock.some(
                (item) => item.lockNumber === element.lockNumber
              );
              if (!exists) {
                this.requestedToLockUnlock.push(element);
              }
              if (element.instruction_id === 4)
                element.instructionRequested = false;
            }
          });

          console.log(this.requestedToLockUnlock);
          console.log(this.BikeProduceDetailsList);
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  locateBike(zoneLatlng) {
    // if(zone.bikeBookedStatusName === "reserved"){
    this.zoom = 20;
    this.lat = Number(zoneLatlng.latitude);
    this.lng = Number(zoneLatlng.longitude);

    this.activeBikeLocationLatLng.push(zoneLatlng);
    console.log(this.activeBikeLocationLatLng);
    // }else{
    // this.toastr.warning("This Bike is not Active")
    // }
  }

  availableBikeList: any = [];
  AvailableRideTableHide: boolean = false;
  availableBike() {
    this.AvailableRideTableHide = true;
    this.batteryRideTableHide = false;
    this.geoFencingTableHide = false;
    this.activeRideTableHide = false;
    this.maintenceRideTableHide = false;
    this.stationaryBikeTableHide = false;

    this.availableBikeCols = [];

    this.availableBikeCols.push(
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
        key: 'lockNumber',
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
    )
    this.checkClientRequireColumn(this.availableBikeCols, Available)

    this.availableBikeCols.push({
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
        key: 'externalBattV',
        display: 'External Battery Voltage',
        sort: true,
      },
      {
        key: 'bikeProduceIds',
        display: 'Action',
        sort: false,
        config: {
          actions: [
            MAINTENANCE,
            LOCATEBUTTON,
            LOCKBUTTON,
            // LIGHTBUTTON,
            // BEEPBUTTON,
          ],
          isbutton: true,
          isClickAble: true,
        },
      },)

    this.checkClientRequiredActions(this.availableBikeCols, Available)

    this.availablebikeList();
  }

  availablebikeList() {
    this.availableBikeList = []
    this.spinner.show();
    const obj = {
      mapCityName: '',
      mapStateName: '',
      mapCountryName: '',
    };
    this.subscription.push(
      this.ProduceBikeService.getAvaialableBikeList(obj).subscribe((res) => {
        if (res.statusCode === 200) {
          res.data.forEach((element) => {
            element.locationData = true;
          });
          this.availableBikeList = res.data;
          console.log(res.data, 'available');
          this.spinner.hide();
          //this.BikeProduceDetailsList.push( res.data.find(e => e.allotmentStatusName === 'Allocated'))
        } else if (res.statusCode === 422) {
          this.spinner.hide();
          this.toastr.warning(res.message);
        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );
    // this.spinner.hide()
  }

  stationaryBike() {
    this.AvailableRideTableHide = false;
    this.batteryRideTableHide = false;
    this.geoFencingTableHide = false;
    this.activeRideTableHide = false;
    this.maintenceRideTableHide = false;
    this.stationaryBikeTableHide = true;

    this.stationaryBikeCols = [];

    this.stationaryBikeCols.push(
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
        key: 'lockNumber',
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
        key: 'instructionName',
        display: 'IOT Device  Instruction Name',
        sort: true,
      },
      {
        key: 'device_lock_unlock_status',
        display: 'Device Locking Status',
        sort: true,
      }
    );

    this.checkClientRequireColumn(this.stationaryBikeCols, Available)

    this.stationaryBikeCols.push(
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
            LOCATEBUTTON,
            LOCKBUTTON
          ],
          isbutton: true,
          isClickAble: true,
        },
      },)

    this.checkClientRequiredActions(this.stationaryBikeCols, Available)

    this.getStationaryVehicleList();
  }

  getStationaryVehicleList() {
    this.stationaryBikeList = []
    this.spinner.show();
    const obj = {
      mapCityName: '',
      mapStateName: '',
      mapCountryName: '',
    };

    this.subscription.push(
      this.ProduceBikeService.getAvaialableBikeList(obj).subscribe((res) => {
        if (res.statusCode === 200) {

          let _bikeList = res.data;

          _bikeList.forEach((element) => {
            element.locationData = true;
          });

          _bikeList = _bikeList.filter((vehicle: any) => {
            return +vehicle.powerOnOffStatusEnumId === enumCodeConstants.powerOn ||
              +vehicle.device_lock_and_unlock_status === enumCodeConstants.unlock;
          });

          console.log(_bikeList);

          this.stationaryBikeList = _bikeList;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );
    // this.spinner.hide()
  }

  geoFencingBike() {
    this.AvailableRideTableHide = false;
    this.batteryRideTableHide = false;
    this.activeRideTableHide = false;
    this.maintenceRideTableHide = false;
    this.geoFencingTableHide = true;
    this.stationaryBikeTableHide = false;

    this.geoFencingBikeCols = [];

    this.geoFencingBikeCols.push(
      {
        key: 'ids',
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
        key: 'mobileNo',
        display: 'Mobile No.',
        sort: true,
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
        key: 'rideBookingNo', //lockId
        display: 'Ride Booking No.',
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
        key: 'instruction_name',
        display: 'IOT Device  Instruction Name',
        sort: true,
      },
    )

    this.checkClientRequireColumn(this.geoFencingBikeCols, 'geoOut')

    this.geoFencingBikeCols.push(
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
        key: 'externalBattV',
        display: 'External Battery Voltage',
        sort: true,
      },

      {
        key: 'bikeProduceIds',
        display: 'Action',
        sort: false,
        config: {
          actions: [
            // MAINTENANCE,
            LOCATEBUTTON,
            LOCKBUTTON,
            // LIGHTBUTTON,
            // BEEPBUTTON,
          ],
          isbutton: true,
          isClickAble: true,
        },
      },
    )
    this.checkClientRequiredActions(this.geoFencingBikeCols, 'geoOut')


    this.geoFencingBikeList();
  }

  geoFencingBikeList() {
    this.spinner.show();
    const obj = {
      mapCityName: '',
      mapStateName: '',
      mapCountryName: '',
    };
    this.subscription.push(
      this.dashboardService.getOutsideGeoFencingList(obj).subscribe((res) => {
        if (res.statusCode === 200) {
          console.log(res.data);
          res.data.forEach((element) => {
            element.locationData = true;
          });
          this.geoFencingList = res.data;
          this.spinner.hide();

          //this.BikeProduceDetailsList.push( res.data.find(e => e.allotmentStatusName === 'Allocated'))
        } else if (res.statusCode === 422) {
          this.spinner.hide();
          this.toastr.warning(res.message);
        } else {
          this.spinner.hide();

          this.toastr.warning(res.message);
        }
        this.spinner.hide();
      })
    );
  }

  // withdrawUserListForPending(requestId,id,withdrawRequestStatusEnumId){
  //   this.spinner.show();
  //   this.subscription.push(this.withdrawService.WithdrawDetails(requestId,id,withdrawRequestStatusEnumId).subscribe((res) => {
  //     if(res.statusCode === 200){
  //       res.data.forEach((element) => {
  //         element.locationData = true;
  //       });
  //       res.data.sort(
  //         (objA, objB) =>  new Date(objB.createdOnDate).getTime() - new Date(objA.createdOnDate).getTime(),
  //       );
  //     
  //       this.withdrawInPending = res.data;
  //     
  //      
  //       this.spinner.hide();
  //     }else{
  //       this.toastr.warning(res.message)
  //       this.spinner.hide();
  //     }
  //   }))
  // }

  maintenceRideTableHide: boolean = false;
  maintenceBikeCols = [];
  maintenceBikeData = [];
  maintenceBike() {
    this.AvailableRideTableHide = false;
    this.batteryRideTableHide = false;
    this.activeRideTableHide = false;
    this.geoFencingTableHide = false;
    this.maintenceRideTableHide = true;
    this.stationaryBikeTableHide = false;
    this.maintenceBikeCols = [];


    this.maintenceBikeCols.push(
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
    )

    this.checkClientRequireColumn(this.maintenceBikeCols, UnderMaintenance)

    this.maintenceBikeCols.push(
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
        key: 'externalBattV',
        display: 'External Battery Voltage',
        sort: true,
      },

      {
        key: 'bikeProduceIds',
        display: 'Action',
        sort: false,
        config: {
          actions: [
            AVAILABLE,
            LOCATEBUTTON,
            LOCKBUTTON,
            // LIGHTBUTTON,
            // BEEPBUTTON,
          ],
          isbutton: true,
          isClickAble: true,
        },
      },
    )
    this.checkClientRequiredActions(this.maintenceBikeCols, UnderMaintenance)


    this.maintenanceBikes();
  }

  maintenanceBikes() {
    this.spinner.show();
    const obj = {
      mapCityName: '',
      mapStateName: '',
      mapCountryName: '',
    };

    this.subscription.push(
      this.dashboardService.getBikeMaintenceList(obj).subscribe((res) => {
        if (res.statusCode === 200) {
          console.log(res.data);
          res.data.forEach((element) => {
            element.locationData = true;
          });
          this.maintenceBikeData = res.data;
          console.log(this.maintenceBikeData, 'maintenceBikeData');
          this.spinner.hide();

          //this.BikeProduceDetailsList.push( res.data.find(e => e.allotmentStatusName === 'Allocated'))
        } else if (res.statusCode === 422) {
          this.toastr.warning(res.message);
          this.spinner.hide();
        } else {
          this.toastr.warning(res.message);
          this.spinner.hide();
        }
      })
    );
    // this.spinner.hide()
  }

  onActionHandler(event) {
    console.log(event);
  }

  checkUpdate(e) {
    console.log(e);
    this.getDashboardCard();
    this.availablebikeList();

    this.maintenanceBikes();
  }

  checkUpdateActive(e) {
    console.log(e);
    this.getDashboardCard();
    this.getActiveBookRide();
    this.availablebikeList();
    this.maintenanceBikes();
  }

  checkUpdateForAvailable(e) {
   
    this.availableBikeList = []
    this.availablebikeList();
    this.getDashboardCard();

  }

  checkUpdateForActive(e) {
    this.getDashboardCard();
    this.getActiveBookRide()

  }

  gotozonemap() {
    this.router.navigate(['./main/zoneMap']);
  }

  private toSafeNumber(value: any): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  getFleetGraphData() {
    return [
      {
        key: 'active',
        label: 'Active Ride',
        value: this.toSafeNumber(this.DashboardCard?.bookedBike),
        gradient: 'linear-gradient(90deg, #16a34a, #22c55e)',
      },
      {
        key: 'available',
        label: 'Available',
        value: this.toSafeNumber(this.DashboardCard?.availableBike),
        gradient: 'linear-gradient(90deg, #2563eb, #3b82f6)',
      },
      {
        key: 'maintenance',
        label: 'Maintenance',
        value: this.toSafeNumber(this.DashboardCard?.underMaintenanceBike),
        gradient: 'linear-gradient(90deg, #4b5563, #6b7280)',
      },
      {
        key: 'geofence',
        label: 'Out Of Geofence',
        value: this.toSafeNumber(this.DashboardCard?.bikeOutSideOfGeoFance),
        gradient: 'linear-gradient(90deg, #be185d, #ec4899)',
      },
      {
        key: 'batteryLow',
        label: 'Battery 0-20%',
        value: this.toSafeNumber(this.DashboardCard?.battery0To30),
        gradient: 'linear-gradient(90deg, #dc2626, #ef4444)',
      },
      {
        key: 'batteryMid',
        label: 'Battery 21-50%',
        value: this.toSafeNumber(this.DashboardCard?.battery30To50),
        gradient: 'linear-gradient(90deg, #ca8a04, #eab308)',
      },
      {
        key: 'batteryHigh',
        label: 'Battery 51-100%',
        value: this.toSafeNumber(this.DashboardCard?.batteryMore50),
        gradient: 'linear-gradient(90deg, #4d7c0f, #84cc16)',
      },
    ];
  }

  getFleetOpsData() {
    return this.getFleetGraphData().filter((item) =>
      ['active', 'available', 'maintenance', 'geofence'].includes(item.key)
    );
  }

  getFleetTotal(): number {
    return (
      this.toSafeNumber(this.DashboardCard?.bookedBike) +
      this.toSafeNumber(this.DashboardCard?.availableBike) +
      this.toSafeNumber(this.DashboardCard?.underMaintenanceBike)
    );
  }

  getBatteryTotal(): number {
    return (
      this.toSafeNumber(this.DashboardCard?.battery0To30) +
      this.toSafeNumber(this.DashboardCard?.battery30To50) +
      this.toSafeNumber(this.DashboardCard?.batteryMore50)
    );
  }

  getRatioPercent(value: any, total: any): number {
    const safeValue = this.toSafeNumber(value);
    const safeTotal = this.toSafeNumber(total);

    if (!safeTotal) {
      return 0;
    }

    return Math.min(100, Math.round((safeValue / safeTotal) * 100));
  }

  getFleetBarWidth(value: number): number {
    const values = this.getFleetGraphData().map((item) => item.value);
    const max = Math.max(...values, 1);
    return Math.max(8, Math.min(100, (this.toSafeNumber(value) / max) * 100));
  }

  getFleetDonutGradient(): string {
    const active = this.toSafeNumber(this.DashboardCard?.bookedBike);
    const available = this.toSafeNumber(this.DashboardCard?.availableBike);
    const maintenance = this.toSafeNumber(this.DashboardCard?.underMaintenanceBike);
    const total = active + available + maintenance;

    if (!total) {
      return 'conic-gradient(#e5e7eb 0 100%)';
    }

    const activePercent = (active / total) * 100;
    const availablePercent = (available / total) * 100;
    const firstStop = activePercent;
    const secondStop = activePercent + availablePercent;

    return `conic-gradient(#22c55e 0 ${firstStop}%, #3b82f6 ${firstStop}% ${secondStop}%, #6b7280 ${secondStop}% 100%)`;
  }

  onFleetGraphClick(key: string) {
    switch (key) {
      case 'active':
        this.card = 'activeBike';
        this.rideBookList();
        break;
      case 'available':
        this.card = 'available';
        this.availableBike();
        break;
      case 'maintenance':
        this.card = 'maintence';
        this.maintenceBike();
        break;
      case 'geofence':
        this.card = 'geo';
        this.geoFencingBike();
        break;
      case 'batteryLow':
        this.card = 'battery20';
        this.batteryData('lessTwenty', 20);
        break;
      case 'batteryMid':
        this.card = 'battery50';
        this.batteryData('bwTwentyFifty', 50);
        break;
      case 'batteryHigh':
        this.card = 'battery100';
        this.batteryData('aboveFifty', 100);
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervals);
  }
}
