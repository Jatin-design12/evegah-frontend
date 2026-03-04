import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild , Input} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DataNotAvailable } from 'src/app/core/constants/common-constant';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { ProduceBikeService } from 'src/app/core/services/produceBike/produceBike.service';
import { ZoneMapService } from 'src/app/core/services/zone-map.service';

@Component({
  selector: 'app-zone-map',
  templateUrl: './zone-map.component.html',
  styleUrls: ['./zone-map.component.scss'],
})
export class ZoneMapComponent implements OnInit {
  mapFilterForm: FormGroup;
  typeDropdown = new Uiconfig();
  zoneDropdown = new Uiconfig();
  bikeIdDropdown = new Uiconfig();
  stateDropdown = new Uiconfig();
  cityDropdown = new Uiconfig();
  areaTypeDropdown = new Uiconfig();
  @Input() locateBikeData:any

  title: string = 'AGM project';
  eveghaZoneMarkers: any = [];
  subscription: Subscription[] = [];
  latitude: number;
  longitude: number;
  address: any;
  private geoCoder;
  zoneData = [];
  bikeData: any =[];
  // inputValue = "mahima"
  @ViewChild('search', { static: false })
  public origin: any;
  public destination: any;
  optimizeWaypoints: boolean = true;
  dir = { origin: {}, destination: {} };
  renderOptions = { suppressMarkers: true };
  isMarkersVisible = true;
  public searchElementRef: ElementRef;
  myLocationIconUrl = '../../../../../assets/images/blue-circle.png';
  evegahZoneIconUrl = "'../../../../../assets/images/evegah_green.ico";
  showContinueToRideControl = false;

  public markerOptions = {
    origin: {
      // icon: 'https://www.shareicon.net/data/32x32/2016/04/28/756617_face_512x512.png',
      draggable: true,
      label: 'Start Point',
    },
    destination: {
      // icon: 'https://www.shareicon.net/data/32x32/2016/04/28/756626_face_512x512.png',
      label: 'End Point',
      // opacity: 0.8,
    },
  };

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public zoneServices: ZoneMapService,
    private toastr: ToastrService,
    private ProduceBikeService: ProduceBikeService,
    private dashboardService:DashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // console.log(this.locateBikeData, "check locateBikeData")

    if(this.locateBikeData) this.getAddressFromBikeCordinate(this.locateBikeData)
    
    this.geoCoder = new google.maps.Geocoder();
    // this.getRideBookingDetail();
    this.setCurrentLocation();
    // this.zonelist();
    // this.calculateDistance();
    this.mapFilterForm = this.formBuilder.group({
      val: [''],
      val2: [''],
    });
    this.setDefaultConfig();
  }

  getAddressFromBikeCordinate(data){
    // console.log(data,)
    const latLng={
      lat:Number(data.latitude),
      lng:Number(data.longitude)
    }
    const geocoder = new google.maps.Geocoder();
    this.setAddressInForm(geocoder, latLng)
  }

  // address:any
  // addressDetail:any
  setAddressInForm(geocoder, latlng) {
    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          
          this.address = response.results[0];

          let locality: any = this.address.address_components.filter((c) => {
            if (c.types.includes('locality')) return c.long_name;
          });
          let administrative_area_level_3: any =
            this.address.address_components.filter((c) => {
              if (c.types.includes('administrative_area_level_3'))
                return c.long_name;
            });
          let administrative_area_level_2 =
            this.address.address_components.filter((c) => {
              if (c.types.includes('administrative_area_level_2'))
                return c.long_name;
            });
          let administrative_area_level_1 =
            this.address.address_components.filter((c) => {
              if (c.types.includes('administrative_area_level_1'))
                return c.long_name;
            });
          let country = this.address.address_components.filter((c) => {
            if (c.types.includes('country')) return c.long_name;
          });
          let postal_code = this.address.address_components.filter((c) => {
            if (c.types.includes('postal_code')) return c.long_name;
          });
          // let plus_code = this.address.address_components.filter((c) => {
          //   //console.log(c,"row")
          //   if (c.types.includes('plus_code')) return c.long_name;
          // });
          let pincode;
          if (postal_code.length > 0) {
            pincode = postal_code[0].long_name;
          } else {
            pincode = 'No Pincode Available';
          }

          function notAvailable(array) {
            if (array.length > 0) return array[0].long_name;
            else return DataNotAvailable
          }
          const addressObject = {
            city: notAvailable(locality),
            district: notAvailable(administrative_area_level_3),
            division: notAvailable(administrative_area_level_2),
            state: notAvailable(administrative_area_level_1),
            country: country[0].long_name,
            pincode: pincode,
            placeId: this.address.place_id,
            address: this.address.formatted_address,
          };
          this.addressDetail = addressObject;
          // console.log(this.addressDetail, 'getAddress()');
          this.addressDetail ={ ... this.addressDetail, ...this.locateBikeData}
          // this.addressDetail.lockNumber= this.locateBikeData.lockNumber

        } else {
          window.alert('No results found');
        }
      })
      .catch((e) => window.alert('Geocoder failed due to: ' + e));
  }

  

  setDefaultConfig() {
    // select zone or bike dropdown
    (this.typeDropdown.label = 'Select Type'),
      //  Bike id
      (this.bikeIdDropdown.label = 'Select Bike ID'),
      // select zone dropdown
      (this.zoneDropdown.label = 'Select Zone Type'),
      //State
      (this.stateDropdown.label = 'Select State');

    //City
    this.cityDropdown.label = 'Select City';

    //Area
    this.areaTypeDropdown.label = 'Select Area Type';
  }

  //api start
  zonelist() {
    this.subscription.push(
      this.zoneServices.zoneDetails().subscribe((res) => {
        if (res.statusCode === 200) {
          this.zoneData = res.data;
          console.log(this.zoneData, 'zoneData');
          this.zoneData.forEach((element) => {
            this.getZoneDetails(element.zoneid);
          });
        } else if (res.statusCode === 401) {
          // this.authService.logout();
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  getZoneDetails(zoneid) {
    this.subscription.push(
      this.zoneServices.getZoneList(zoneid, 0).subscribe((res) => {
        if (res.statusCode === 200) {
          res.data.forEach((element) => {
            this.eveghaZoneMarkers.push({
              zoneAddress: element.zoneAddress,
              latitude: element.latitude,
              longitude: element.longitude,
              name: element.name,
              id: element.id,
            });
          });
        } else if (res.statusCode === 401) {
          // this.authService.logout();
        } else {
          this.toastr.warning(res.message);
        }
      })
    );
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  markerDragEnd($event: any) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.address = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          //window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  clickedMarker(zone: any, index: number) {
    this.dir = {
      origin: {
        lat: this.latitude,
        lng: this.longitude,
        icon: {
          url: '',
          scaledSize: {
            width: 40,
            height: 40,
          },
        },
      },
      destination: {
        lat: Number(zone.latitude),
        lng: Number(zone.longitude),
        icon: {
          url: '',
          scaledSize: {
            width: 40,
            height: 40,
          },
        },
      },
    };
  }

  receivename(event: any) {
    this.getAllAreaDraw(event.stateCity);
  }

  showAllMap: any = [];
  addressDetail: any;
  getAllAreaDraw(data) {
    this.address = data;
    let locality: any = this.address.filter((c) => {
      if (c.types.includes('locality')) return c.long_name;
    });

    let administrative_area_level_3: any = this.address.filter((c) => {
      if (c.types.includes('administrative_area_level_3')) return c.long_name;
    });
    let administrative_area_level_2 = this.address.filter((c) => {
      if (c.types.includes('administrative_area_level_2')) return c.long_name;
    });
    let administrative_area_level_1 = this.address.filter((c) => {
      if (c.types.includes('administrative_area_level_1')) return c.long_name;
    });
    let country = this.address.filter((c) => {
      if (c.types.includes('country')) return c.long_name;
    });
    let postal_code = this.address.filter((c) => {
      if (c.types.includes('postal_code')) return c.long_name;
    });

    let pincode;
    if (postal_code.length > 0) {
      pincode = postal_code[0].long_name;
    } else {
      pincode = 'No Pincode Available';
    }
    // check Array lenth and retunrn 0
    function Na(array) {
      if (array.length > 0) return array[0].long_name;
      else return '';
    }

    let addressObject = {
      city: Na(locality),
      // district: administrative_area_level_3[0].long_name ,
      // division: administrative_area_level_2[0].long_name ,
      state: Na(administrative_area_level_1),
      country: country[0].long_name,
      pincode: pincode,
      placeId: this.address.place_id,
      address: this.address.formatted_address,
    };

    this.addressDetail = addressObject;

    let obj = {
      areaId: 0,
      cityId: 0,
      country: this.addressDetail.country, //"India",
      state: this.addressDetail.state, //"Madhya Pradesh",
      city: this.addressDetail.city, //'Dewas',
      dataFor: 'ForMapSearch',
    };
    // this.subscription.push(
    //   this.zoneServices
    //     .getzoneDetailBySearch(
    //       0,
    //       0,
    //       obj.country,
    //       obj.state,
    //       obj.city,
    //       obj.dataFor
    //     )
    //     .subscribe((res) => {
    //       if (res.statusCode === 200) {
    //         this.showAllMap = res.data;
    //         // this.showAllAreaOnMap(this.showAllMap);
    //         console.log(res.data, 'sreach Area Data');
    //       } else {
    //         // this.toastr.warning(res.message);
    //       }
    //     })
    // );

    // this.getBikeDataApi(obj);
  }

  getBikeDataApi(data) {
    console.log(data);
    const obj = {
      mapCityName: data.city,
      mapStateName: data.state,
      mapCountryName: data.country,
      dataFor: 'ForMapSearch',
    };
    
    this.subscription.push(
      this.zoneServices
        .getzoneDetailBySearch(
          0,
          0,
          obj.mapCountryName,
          obj.mapStateName,
          obj.mapCityName,
          obj.dataFor
        )
        .subscribe((res) => {
          if (res.statusCode === 200) {
            this.showAllMap = res.data;
            // this.showAllAreaOnMap(this.showAllMap);
          } else {
            // this.toastr.warning(res.message);
          }
        })
    );
    let Data: any=[]
    this.bikeData = []
    this.ProduceBikeService.getActiveBookBikeDetails(obj).subscribe((res) => {
      if (res.statusCode === 200) {
        let data= {
          data:res.data,
          type:"ActiveBike"
        }
        this.bikeData.push(data) 
      }
    })

    this.ProduceBikeService.getAvaialableBikeList(obj).subscribe((res) => {
      if (res.statusCode === 200) {
        let data= {
          data:res.data,
          type:"AvailableBike"
        }
        this.bikeData.push(data)

      }
    })
    
    
    this.dashboardService.getBikeMaintenceList(obj).subscribe((res) => {
      if (res.statusCode === 200) {
        let data= {
          data:res.data,
          type:"MaintenanceBike"
        }
        this.bikeData.push(data)

      }
    })

  }

  

  zoneIdByDetail(event) {
    // console.log(event, 'check');
  }
}
