import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  SimpleChange,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Active,
  Available,
  MapZoom,
  ParkingZoneIcon,
  ParkingZoneIconNoBike,
  UnderMaintenance,
  blackBike,
  blackBike_L,
  blueBike,
  blueBike_L,
  geoIn,
  geoOut,
  greenBike,
  greenBike_L,
  iconLabelColor,
  redBike,
  redBike_L,
  yellowBike,
  yellowBike_L,
} from 'src/app/core/constants/common-constant';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { ProduceBikeService } from 'src/app/core/services/produceBike/produceBike.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { TrackVehicleStandComponent } from '../track-vehicle-stand/track-vehicle-stand.component';
import { ToastrService } from 'ngx-toastr';
import { ZoneMapService } from 'src/app/core/services/zone-map.service';
import { Subscription, forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardMapBikeModalComponent } from 'src/app/main/dashboard-map-bike-modal/dashboard-map-bike-modal.component';

declare var google: any;
declare global {
  interface Window {
    initMap: () => void;
    intiDrawing: () => void;
  }
}

declare global {
  interface Window {
    intiDrawing: () => void;
  }
}
declare global {
  interface Window {
    showModelList: (data: any) => void;
  }
}
@Component({
  selector: 'app-draw-map',
  templateUrl: './draw-map.component.html',
  styleUrls: ['./draw-map.component.scss'],
})
export class DrawMapComponent implements OnInit {
  map: any;
  latlngData;
  zoneAddress;
  public lat;
  public lng;
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild('infowindowContent')
  public infowindowContentElementRef!: ElementRef;
  @ViewChild('placeName')
  public placeNameElementRef!: ElementRef;
  @ViewChild('placeId')
  public placeId!: ElementRef;
  @ViewChild('placeAddress')
  public placeAddress!: ElementRef;
  @Output() nameEmitter = new EventEmitter<string>();
  @Output() latlngEmitter = new EventEmitter<string>();
  @Output() Address = new EventEmitter<any>();
  @Output() zoneDatail = new EventEmitter<string>();
  @Input() zoneData: any;
  @Input() AllBikeData: any;
  @Input() addressData: any;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  @ViewChild('btn', { read: ElementRef, static: false }) btnRef: ElementRef;

  intervals: any;
  markers: google.maps.Marker[] = [];
  subscription: Subscription[] = [];
  bikeData: any = [];
  showAllMap: any;
  allApiInterval: any;
  constructor(
    public ProduceBikeService: ProduceBikeService,
    private dailogRef: MatDialog,
    private dashboardService: DashboardService,
    public zoneServices: ZoneMapService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private el: ElementRef
  ) {}
  availableBikeList: any = {};
  iotSearchTerm: string = '';
  private lastNoMatchSearchTerm: string = '';
  ngOnInit() {}
  getBikeByZoneId(id) {
    this.availableBikeList = {};
    this.dashboardService.getBikeByZoneIdForMap(id).subscribe((res) => {
      if (res.statusCode === 200) {
        this.availableBikeList = res.data;
        // console.log(res.data, 'available');
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private getNormalizedMapFilter(data?: any) {
    return {
      city: (data?.city || data?.mapCityName || '').toString().trim(),
      state: (data?.state || data?.mapStateName || '').toString().trim(),
      country: (data?.country || data?.mapCountryName || '').toString().trim(),
    };
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
          // this.zoom = 15;
          const myLatLng = { lat: this.lat, lng: this.lng };
          this.showMap(this.lat, this.lng);
          const options = {
            center: myLatLng,
            zoom: 15,
            disableDefaultUI: false,
          };
          // this.map = new google.maps.Map(this.mapRef.nativeElement,options)
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  showMap(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    const options = {
      center: location,
      zoom: MapZoom,
      streetViewControl: true,
      mapTypeControl: false,
      fullscreenControl: true,
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    const mapStylesOptions1 = [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
      },
    ];

    this.map.setOptions({ styles: mapStylesOptions1 });
    ///////////////////////////////////Search Address Code/////////////////////////////////////
    if (!this.searchElementRef || !this.searchElementRef.nativeElement) {
      return;
    }

    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );

    autocomplete.bindTo('bounds', this.map);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = this.infowindowContentElementRef.nativeElement;

    infowindow.setContent(infowindowContent);

    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      const place = autocomplete.getPlace();
      this.iotSearchTerm = '';
      this.lastNoMatchSearchTerm = '';
      this.zoneAddress = place;
      if (this.zoneAddress) {
        const zoneFormData: any = {
          address: this.zoneAddress.formatted_address,
          stateCity: this.zoneAddress.address_components,
        };
        this.nameEmitter.emit(zoneFormData);
      }

      if (!place.geometry || !place.geometry.location) {
        return;
      }
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(MapZoom);
      }

      infowindow.close();
    });

    const mapStylesOptions = [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
      },
    ];

    this.map.setOptions({ styles: mapStylesOptions });
  }
  showLatLng() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }
          const myLatLng = { lat: this.lat, lng: this.lng };
          this.showMap(this.lat, this.lng);
          const options = {
            center: myLatLng,
            zoom: 15,
            disableDefaultUI: true,
          };
          // this.map = new google.maps.Map(this.mapRef.nativeElement,options)
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
          const marker = new google.maps.Marker({
            position: location,
            map: this.map,
            icon: '../../../../assets/images/evegah_green.png',
          });

          // Create the initial InfoWindow.
          let infoWindow = new google.maps.InfoWindow({
            content: 'Click the map to get Lat/Lng!',
            position: location,
          });

          infoWindow.open(this.map, marker);

          this.map.addListener('click', (mapsMouseEvent) => {
            this.latlngData = mapsMouseEvent.latLng.toJSON();
            infoWindow = new google.maps.InfoWindow({
              position: mapsMouseEvent.latLng,
            });

            this.latlngEmitter.emit(this.latlngData);
            infoWindow.close();
            infoWindow.setContent(
              JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
            );
            infoWindow.open(this.map);
          });
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  cordinateData: any = [];
  myselectedPath: any;

  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          this.showMap(this.lat, this.lng);

          this.callAllBike_ZoneApi(this.getNormalizedMapFilter());
        }

        const mapStylesOptions = [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
          },
        ];

        this.map.setOptions({ styles: mapStylesOptions });
      });
    }
  }
  isLocate: boolean = false;
  ngOnChanges(change: SimpleChange) {
    clearInterval(this.intervals);
    clearInterval(this.allApiInterval);
    this.isbikeRefresh = false;
    // console.log(this.addressData, 'adddress');

    this.setMapOnAll(null);
    this.markers = [];
    this.isLocate = false;

    if (this.addressData !== undefined) {
      console.log(this.addressData,"locate button")
      if (this.addressData.lockNumber !== undefined) {
        this.isLocate = true;
        const latLng = {
          lat: Number(this.addressData.latitude),
          lng: Number(this.addressData.longitude),
        };
        const location = new google.maps.LatLng(
          this.addressData.latitude,
          this.addressData.longitude
        );
        this.map.setCenter(location);
        this.map.setZoom(15);
        this.setLocateBtnCircle(latLng);
        // this.setLocateMarker(this.addressData)
      }
      this.callAllBike_ZoneApi(this.getNormalizedMapFilter(this.addressData));
    } else {
      this.callAllBike_ZoneApi(this.getNormalizedMapFilter());
    }
  }
  isbikeRefresh: boolean = false;
  callAllBike_ZoneApi(obj) {
    this.setMapOnAll(null);
    this.markers = [];
    this.getBikeDataApi(obj);
    this.allApiInterval = setInterval(() => {
      this.getBikeDataApi(obj);
      this.isbikeRefresh = true;
    }, 10000);
  }

  getBikeDataApi(data) {
    // console.log(data,"api data")
    // this.setMapOnAll(null);
    // this.markers = [];
    // console.log(data);
    const obj = {
      mapCityName: data.city,
      mapStateName: data.state,
      mapCountryName: data.country,
      bikeId: 0,
      dataFor: 'ForMapSearch',
    };

    this.zoneServices
      .getzoneDetailBySearchWithTotalCountForAllBike(
        //getzoneDetailBySearch(
        0,
        0,
        obj.bikeId,
        obj.mapCountryName,
        obj.mapStateName,
        obj.mapCityName,
        obj.dataFor
      )
      .subscribe((res) => {
        if (res.statusCode == 200) {
          this.showAllMap = res.data;
          if (this.hasIotSearch()) {
            this.isbikeRefresh = false;
            this.renderMapDataFromState();
            return;
          }
          if (this.isbikeRefresh) {
            this.updateBikeData(this.showAllMap);
          } else {
            if (!this.isLocate) {
              this.showAllZoneOnMap(this.showAllMap);
            }

            this.allBikeData(this.showAllMap);
          }
        } else if (res.statusCode == 422) {
          this.toastr.warning('no zone available');
          clearInterval(this.allApiInterval);
          // this.setLocateMarker(data)
          if (data.locationData) {
            this.islocateOnlyBike = true;
            this.setLocateMarker(data);
          }
        }
      });
  }

  allBikeData(data, ...a) {
    const locateLockNumber = this.isLocate
      ? String(this.addressData?.lockNumber || '').trim().toUpperCase()
      : '';

    data.forEach((zoneData, i) => {
      let map = this.map; // google.maps.Map//this.map;
      let bike;
      let ActiveBike;
      let updateBike: any = a;
      let check = this.dailogRef;
      let infowindows = new google.maps.InfoWindow();

      // active
      if (
        zoneData['activeBikeListData'] &&
        zoneData.activeBikeListData.length > 0
      ) {
        zoneData.activeBikeListData.forEach((e, i) => {
          if (!this.matchesIotSearch(e.lockNumber)) {
            return;
          }
          if (locateLockNumber && String(e.lockNumber || '').trim().toUpperCase() !== locateLockNumber) {
            return;
          }
          let time = this.datePipe.transform(e.fromRideTime, 'h:mm a');
          e.startTime = time;

          e.iconName = greenBike;
          if (this.isLocate)
            if (e.lockNumber == this.addressData.lockNumber)
              e.iconName = greenBike_L;
          this.bikeTracking(e, bike, greenBike, check, infowindows);
        });
      }

      // available bike && !this.isbikeRefresh
      if (
        zoneData['avaialableBikeListData'] &&
        zoneData.avaialableBikeListData.length > 0
      ) {
        zoneData.avaialableBikeListData.forEach((e) => {
          if (!this.matchesIotSearch(e.lockNumber)) {
            return;
          }
          if (locateLockNumber && String(e.lockNumber || '').trim().toUpperCase() !== locateLockNumber) {
            return;
          }
          e.iconName = blueBike;
          if (this.isLocate)
            if (e.lockNumber == this.addressData.lockNumber)
              e.iconName = blueBike_L;
          this.bikeTracking(e, bike, blueBike, check, infowindows);
        });
      }

      // maitencene bike
      if (
        zoneData['underMantanceBikeListData'] &&
        zoneData.underMantanceBikeListData.length > 0
      ) {
        zoneData.underMantanceBikeListData.forEach((e) => {
          if (!this.matchesIotSearch(e.lockNumber)) {
            return;
          }
          if (locateLockNumber && String(e.lockNumber || '').trim().toUpperCase() !== locateLockNumber) {
            return;
          }
          e.iconName = blackBike;
          if (this.isLocate)
            if (e.lockNumber == this.addressData.lockNumber)
              e.iconName = blackBike_L;
          this.bikeTracking(e, bike, blackBike, check, infowindows);
        });
      }
    });

    if (this.hasIotSearch()) {
      this.focusOnMatchedBikeMarkers();
      this.showNoMatchWarningIfNeeded();
    }
  }

  showAllZoneOnMap(data) {
    let map = this.map; //new google.maps()
    let marker: any;
    let activeInfoWindow;
    let zoneData = this.availableBikeList;
    let check = this.dailogRef;
    // this.latlngData = mapsMouseEvent.latLng.toJSON();
    let infowindow = new google.maps.InfoWindow({
      // position: mapsMouseEvent.latLng,
    });
    // this.map.setZoom(MapZoom)
    // const infowindow = new google.maps.InfoWindow();
    data.forEach((obj) => {
      let zoneWiseBike;
      obj.activeBikeListData.forEach((e) => {
        // this.checkGeoFenceStatus(e)  // add geofence variable
        this.checkBattery(e);
        this.checkGeoFenceOut(e);
      });
      obj.underMantanceBikeListData.forEach((e) => {
        // this.checkGeoFenceStatus(e)
        this.checkBattery(e);
        this.checkGeoFenceOut(e);
      });
      obj.avaialableBikeListData.forEach((e) => {
        // this.checkGeoFenceStatus(e)
        this.checkBattery(e);
        this.checkGeoFenceOut(e);
      });
      let allData: any = [
        ...obj.avaialableBikeListData,
        ...obj.underMantanceBikeListData,
        ...obj.activeBikeListData,
      ];
      zoneWiseBike = allData;
      let latLng = {
        lat: Number(obj.latitude),
        lng: Number(obj.longitude),
      };
      infowindow = new google.maps.InfoWindow({
        position: latLng,
      });

      if (this.isbikeRefresh) {
        marker = this.markers.find((el: any) => el.zone == obj.zoneId);
      } else {
        if(obj.totalBikeCount == 0) {
          marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: `../../../assets/images/${ParkingZoneIconNoBike}`,
            zIndex: 2,
            clickable: true,
            optimized: true,
            // label:obj.zoneName
          });
        }
        else{
          marker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: `../../../assets/images/${ParkingZoneIcon}`,
            zIndex: 2,
            clickable: true,
            optimized: true,
            // label:obj.zoneName
          });
        }
        
      }

      if (this.zoneBikeMarker) {
        this.zoneBikeMarker.close();
      }

      this.markerClickEvent(
        marker,
        obj,
        zoneData,
        activeInfoWindow,
        zoneWiseBike,
        check,
        infowindow
      );

      // infowindow.open(map);

      if (this.isbikeRefresh == false) {
        marker.zone = obj.zoneId;
        this.markers.push(marker);
      }
    });
  }

  getActiveBikeMovement(e, bike) {
    this.ProduceBikeService.getCurrentLocOfDevice(e.lockNumber).subscribe(
      (res) => {
        if (res.statusCode === 200) {
          // // // console.log(res.data);
          let getLocation = res.data;
          let latitude = Number(getLocation[0].latitude); //Number(this.getLocation[0].latitude) +i
          let longitude = Number(getLocation[0].longitude); //Number(this.getLocation[0].longitude) +i
          let latLng = {
            lat: Number(latitude),
            lng: Number(longitude),
          };
          if (!bike) {
            // this.setMarker();
          } else {
            bike.setPosition(latLng);
            bike.setAnimation(google.maps.Animation.BOUNCE);
            // DROP
          }
        }
      }
    );
  }

  setMapOnAll(map: google.maps.Map | null) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervals);
    clearInterval(this.allApiInterval);
  }

  // if out goes fence or less 25%
  checkBikeOutInAvailble(e, bike) {
    if (e.geofenceInOutEnumId == geoOut || e.batteryPercentage < 21) {
      // bike.setIcon('../../../assets/images/bicycle-red.png');
      this.setBikeIcon(bike, 'bicycle-red.png');
    }
  }

  // battery goes 25 - 50
  checkBikeBatterybw25_50(e, bike) {
    if (e.batteryPercentage > 20 && e.batteryPercentage < 51) {
      this.setBikeIcon(bike, yellowBike);
    }
    if (
      e.geofenceInOutEnumId == geoOut &&
      e.batteryPercentage > 20 &&
      e.batteryPercentage < 51
    ) {
      this.setBikeIcon(bike, redBike);
    }

    if (
      e.batteryPercentage > 51 &&
      this.isbikeRefresh &&
      e.geofenceInOutEnumId == geoIn
    ) {
      if (e.bikeStatusName == Active) this.setBikeIcon(bike, greenBike);
      else if (e.bikeStatusName == Available) this.setBikeIcon(bike, blueBike);
      else if (e.bikeStatusName == UnderMaintenance)
        this.setBikeIcon(bike, blackBike);
    } else if (
      e.batteryPercentage > 51 &&
      this.isbikeRefresh &&
      e.geofenceInOutEnumId == geoOut
    ) {
      if (e.bikeStatusName == Active) this.setBikeIcon(bike, redBike);
      else if (e.bikeStatusName == Available) this.setBikeIcon(bike, redBike);
      else if (e.bikeStatusName == UnderMaintenance)
        this.setBikeIcon(bike, blackBike);
    }

    if (e.bikeStatusName == UnderMaintenance) this.setBikeIcon(bike, blackBike);
  }

  checkBattery(e) {
    // e.batteryPercentage = 19
    if (e.batteryPercentage == undefined || e.batteryPercentage == null) {
      e.batteryPercentage = 'NA';
      e.batteryPercentagelow = '';
    } else {
      if (e.batteryPercentage < 21) {
        e.batteryPercentagelow = 'Battery : ' + e.batteryPercentage + '% ';
      } else {
        e.batteryPercentagelow = '';
      }
    }
  }

  checkGeoFenceOut(e) {
    if (e.geofenceInOutEnumId == geoOut) {
      e.geoFenceInOutChecked = e.geoFenceInOut;
      //'GeoOut';
    } else {
      e.geoFenceInOutChecked = '';
    }
  }

  checkGeoFenceStatus(e) {
    if (e.beepInstructionEnumId == 56 || e.beepStatusEnumId == 54) {
      // // // console.log(e.lockNumber," beep On-- geoOut")
      e.geoFenceInOut = e.geoFenceInOut; //'GeoOut'
    } else {
      e.geoFenceInOut = e.geoFenceInOut; //'GeoIn'
    }
  }

  tableData: any;
  getData(id) {
    this.tableData = [];

    this.dashboardService.getBikeByZoneIdForMap(id).subscribe((res) => {
      if (res.statusCode === 200) {
        let data: any = res.data;

        if (
          data.avaialableBikeListData ||
          data.underMantanceBikeListData ||
          data.activeBikeListData
        ) {
          let allData: any = [
            ...data.avaialableBikeListData,
            ...data.underMantanceBikeListData,
            ...data.activeBikeListData,
          ];
          this.tableData = allData;
        }
      }
    });
  }

  setBikeMap(e, iconName) {
    let latLng = {
      lat: Number(e.latitude),
      lng: Number(e.longitude),
    };
    return new google.maps.Marker({
      position: latLng,
      map: this.map,
      // icon: '../../../assets/images/bicycle-blue.png',
      icon: {
        url: `../../../assets/images/${e.iconName}`, //'../../../assets/images/bicycle-blue.png',
        labelOrigin: new google.maps.Point(24, -5),
      },
      zIndex: 2,
      clickable: true,
      // title: e.lockNumber + type,//'Available',
      label: {
        text: e.lockNumber,
        color: iconLabelColor,
        fontSize: '12px',
        fontWeight: 'bold',
      },
      // scale: 2,
      //   anchor: new google.maps.Point(0, 20),
    });
  }

  setBikeIcon(bike, name) {

    bike.name = name;
    if (this.isLocate) {
      if (bike.lock == this.addressData.lockNumber) {
        if (name == blueBike) bike.name = blueBike_L;
        if (name == greenBike) bike.name = greenBike_L;
        if (name == blackBike) bike.name = blackBike_L;
        if (name == yellowBike) bike.name = yellowBike_L;
        if (name == redBike) bike.name = redBike_L;
      }
       else if (this.islocateOnlyBike) {
        if (name == blueBike) bike.name = blueBike_L;
        if (name == greenBike) bike.name = greenBike_L;
        if (name == blackBike) bike.name = blackBike_L;
        if (name == yellowBike) bike.name = yellowBike_L;
        if (name == redBike) bike.name = redBike_L;
      }
// -------------For all
     



    } 
    else {
      bike.name = name;
    }


    let icon = {
      url: `../../../assets/images/${bike.name}`, //'../../../assets/images/bicycle-blue.png',
      labelOrigin: new google.maps.Point(24, -5),
    };
    bike.setIcon(icon);
  }

  getdata(e) {
    console.log('chek', e);
  }

  updateBikeData(data) {
    if (!this.isLocate && !this.hasIotSearch()) {
      this.showAllZoneOnMap(data);
    }
    this.allBikeData(data);

    return;
  }
  bikeInfoWindow: any;
  bikeAddEvent(bike, e, check, infowindows) {
    let activeInfoWindow;
    if (activeInfoWindow) {
      activeInfoWindow.close();
    }
    if (this.bikeInfoWindow) {
      this.bikeInfoWindow.close();
    }
    bike.addListener('click', (mapsMouseEvent) => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
      }
      if (this.bikeInfoWindow) {
        this.bikeInfoWindow.close();
      }

      this.updateBikeContent(e, bike, check, mapsMouseEvent.latLng);
      activeInfoWindow = infowindows;
      this.bikeInfoWindow = infowindows;
    });
  }

  updateBikeContent(e, bike, check, latLng) {
    let activeInfoWindow;
    let infowindows = new google.maps.InfoWindow();

    if (activeInfoWindow) {
      activeInfoWindow.close();
    }
    infowindows.close();
    infowindows.setContent(
      `<p>
        
        </p>
      
        <table class="table info-Table table-striped table-bordered table-hover" id='table' >
        <tr>
        <td>IOT Device  No. </td>
        <td style= "padding-left:10px;  padding-right:10px;">Status </td>
        <td>Battery % </td>
    
        <td>Alert </td>
        </tr>
        <tr >
              <td>
              ${e.lockNumber}<br>
              
              </td>
            <td style= "padding-left:10px;  padding-right:10px;">
           ${e.bikeStatusName}
          <br>
            
            </td>
            <td>
            ${e.batteryPercentage} 
            </td>
              <td>
                ${e.batteryPercentagelow} 
                ${e.geoFenceInOutChecked}
              </td>
          </tr>
      </table>
    
    <p class="btn btn-primary" id="btn" (click)="getdata(e)"> Detail</p>
        `
    );

    if (e.bikeStatusName == 'Active Ride') {
      var existing_content = infowindows.getContent();
      infowindows.setContent(existing_content);

      let html = `<p class="mt-2"> User : ${e.userName}, Mob.: ${e.mobile} , Start Ride : ${e.startTime}</p>`;
      infowindows.setContent(html + existing_content);
    }

    google.maps.event.addListener(infowindows, 'domready', function () {
      document.getElementById('btn').addEventListener('click', () => {
        const dialogRef = check.open(DashboardMapBikeModalComponent, {
          data: e,
          height: '1000px',
          width: '1200px',
        });
        dialogRef.afterClosed().subscribe((result) => {
          infowindows.close();
        });
      });
    });
    infowindows.open(this.map, bike);
    activeInfoWindow = infowindows;
  }

  updateBike(e, bike, check, latLng, infowindows) {
    let activeInfoWindow;

    bike.addListener('click', (mapsMouseEvent) => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
      }
      if (this.bikeInfoWindow) {
        this.bikeInfoWindow.close();
      }

      var existing_content = infowindows.getContent();
      infowindows.setContent(existing_content);
      // infowindows.setContent('')
      infowindows.setContent(
        `<p>
                    
                    </p>
                  
                    <table class=" modalTable table info-Table table-striped table-bordered table-hover" id='table' >
                    <tr>
                    <td>IOT Device ID </td>
                    <td style= "padding-left:10px;  padding-right:10px;">Status </td>
                    <td>Battery % </td>
                
                    <td>Alert </td>
                    </tr>
                    <tr >
                          <td>
                          ${e.lockNumber}<br>
                          
                          </td>
                        <td style= "padding-left:10px;  padding-right:10px;">
                      ${e.bikeStatusName}
                      <br>
                        
                        </td>
                        <td>
                        ${e.batteryPercentage} 
                        </td>
                          <td>
                            ${e.batteryPercentagelow} 
                            ${e.geoFenceInOutChecked}
                          </td>
                      </tr>
                  </table>
                
                <p class="btn btn-primary" id="btn" > Detail</p>
                    `
      );

      if (e.bikeStatusName == 'Active Ride') {
        var existing_content = infowindows.getContent();
        infowindows.setContent(existing_content);

        let html = `<p class="mt-2"> User : ${e.userName}, Mob.: ${e.mobile} , Start Ride : ${e.startTime}</p>`;
        infowindows.setContent(html + existing_content);
      }

      google.maps.event.addListener(infowindows, 'domready', function () {
        document.getElementById('btn').addEventListener('click', () => {
          const dialogRef = check.open(DashboardMapBikeModalComponent, {
            data: e,
            height: '1000px',
            width: '1200px',
          });
          dialogRef.afterClosed().subscribe((result) => {
            infowindows.close();
          });
        });
      });

      infowindows.open(this.map, bike);
      activeInfoWindow = infowindows;
      this.bikeInfoWindow = infowindows;
    });
  }

  activeBikeLocationChange(bike, bikeColor, e, latLng, check) {
    if (this.isbikeRefresh) {
      bike = this.markers.find((el: any) => el.lock == e.lockNumber);
      bike.setPosition(latLng);
    } else {
      bike = this.setBikeMap(e, bikeColor);
      bike.setPosition(latLng);
      // this.bikeAddEvent(bike, e, check, infowindows);
    }
    return bike;
  }

  setBikeAnimationStop(bike) {
    bike.setAnimation(null);
  }

  bikeTracking(e, bike, bikeName, check, infowindows) {
    
    let latLng = {
      lat: Number(e.latitude),
      lng: Number(e.longitude),
    };

    this.checkBattery(e);
    this.checkGeoFenceOut(e);

    if (this.isbikeRefresh) {
      bike = this.markers.find((el: any) => el.lock == e.lockNumber);
      bike.setPosition(latLng);
    } else {
      bike = this.setBikeMap(e, bikeName);
      bike.setPosition(latLng);
    }

    if (e.bikeStatusName == Active) {
      bike.setAnimation(google.maps.Animation.BOUNCE);
    }

    this.updateBike(e, bike, check, latLng, infowindows);
    google.maps.event.addListener(infowindows, 'closeclick', function () {
      // this.bikeInfoWindow.close();
    });

    if (e.bikeStatusName == Available) this.setBikeAnimationStop(bike);

    this.checkBikeOutInAvailble(e, bike);
    this.checkBikeBatterybw25_50(e, bike);

    if (this.isbikeRefresh == false) {
      bike.lock = e.lockNumber;
      this.markers.push(bike);
    }
  }

  zoneBikeMarker: any;
  markerClickEvent(
    marker,
    obj,
    zoneData,
    activeInfoWindow,
    zoneWiseBike,
    check,
    infowindow
  ) {
    console.log()
    marker.addListener('click', (mapsMouseEvent) => {
      
      let zoneName = obj;
      zoneData = { zoneName };

      if (activeInfoWindow) {
        activeInfoWindow.close();
      }
      if (this.zoneBikeMarker) {
        this.zoneBikeMarker.close();
      }
      infowindow.close();
      infowindow.setContent(
        `<div class>
        <p class="text-start"> Zone : ${obj.zoneName},${obj.zone_address} </p>
      <p class="text-start"> Area : ${obj.areaName}, Type :  ${obj.areaType} </p>
      <p class="text-start bikes"> 
      Total No. of vehicle : <strong>${obj.totalBikeCount}</strong>,
       Ride On : <strong>${obj.bookedKikeCount}</strong>,  
       Available vehicle : <strong>${obj.availableBikeCount}</strong>,
       Maintenance vehicle : <strong>${obj.underMaintenanceBikeCount}
       </strong>
       </p>
       </div>
        <table class="table info-Table table-striped table-bordered table-hover"  Id='table'>
      </table>
      `
      );

      infowindow.open(this.map);

      google.maps.event.addListener(infowindow, 'domready', function () {
        if (zoneWiseBike.length > 0) {
          // var existing_content = infowindow.getContent();
          // infowindow.setContent(existing_content);
          var tabe = document.getElementById('table');
          let objs;
          // // console.log(tabe, 'vvjjvvjj');
          var html =
            "<table class='table info-Table table-striped table-bordered table-hover' border='1|1'> <tr><td>IOT Device ID</td><td>Status</td><td>Battery %</td> <td>Alert</td><td></td></tr>";
          for (var i = 0; i < zoneWiseBike.length; i++) {
            html += '<tr>';
            html += '<td>' + zoneWiseBike[i].lockNumber + '</td>';
            html += '<td>' + zoneWiseBike[i].bikeStatusName + '</td>';
            html += '<td>' + zoneWiseBike[i].batteryPercentage + '</td>';
            html +=
              "<td class='text-danger ' >" +
              zoneWiseBike[i].batteryPercentagelow +
              ' ' +
              zoneWiseBike[i].geoFenceInOutChecked +
              '</td>';
            html += `<td><button class='btn1 btn btn-primary' id='btn'  data-id='${i}' > Detail</button></td>`;
            html += '</tr>';
          }
          html += '</table>';

          document.getElementById('table').innerHTML = html;
          infowindow.setContent(
            `<div class="infoModal">
            <p class="text-start"> Zone : ${obj.zoneName},${obj.zone_address} </p>
          <p class="text-start"> Area : ${obj.areaName}, Type :  ${obj.areaType} </p>
          <p class="text-start bikes"> 
          Total No. of vehicle : <strong>${obj.totalBikeCount}</strong>,
           Ride On : <strong>${obj.bookedKikeCount}</strong>,  
           Available vehicle : <strong>${obj.availableBikeCount}</strong>,
           Maintenance vehicle : <strong>${obj.underMaintenanceBikeCount}
           </strong>
           </p>
           </div>
            <table class="table info-Table table-striped table-bordered table-hover"  Id='table'>
          </table>
          `
          );
         var existing_content = infowindow.getContent();

          infowindow.setContent(existing_content + html);
          var userSelection = document.getElementsByClassName('btn1');

          for (let i = 0; i < userSelection.length; i++) {
            userSelection[i].addEventListener('click', (e: any) => {
              // console.log(e, e.target.dataset.id,"btn-click", zoneWiseBike[e.target.dataset.id])

              const dialogRef = check.open(DashboardMapBikeModalComponent, {
                data: zoneWiseBike[e.target.dataset.id],
                height: '1000px',
                width: '1200px',
              });
              dialogRef.afterClosed().subscribe((result) => {
                // infowindow.close();
              });
            });
          }
        }
      });

      activeInfoWindow = infowindow;
      this.zoneBikeMarker = infowindow;
    });
  }

  setLocateMarker(e) {
    let bike;
    let check = this.dailogRef;
    let infowindows = new google.maps.InfoWindow();
    if (this.isLocate) {
      e.bikeStatusName = e.bikeBookedStatusName;
    }
    if (e.bikeBookedStatusName == Available) {
      e.iconName = blueBike_L;
      this.bikeTracking(e, bike, blueBike_L, check, infowindows);
    } else if (e.bikeBookedStatusName == Active) {
      e.iconName = greenBike_L;
      this.bikeTracking(e, bike, greenBike_L, check, infowindows);
    } else if (e.bikeBookedStatusName == UnderMaintenance) {
      e.iconName = blackBike_L;
      this.bikeTracking(e, bike, blackBike_L, check, infowindows);
    }

    const latLng = {
      lat: Number(e.latitude),
      lng: Number(e.longitude),
    };
  }

  islocateOnlyBike: boolean = false;
  setLocateBtnCircle(latLng) {
    // const cityCircle = new google.maps.Circle({
    //   strokeColor: "#000000",
    //   strokeOpacity: 0.3,
    //   strokeWeight: 0,
    //   fillColor: "#000000",
    //   fillOpacity: 0.3,
    //   map:this.map,
    //   center: latLng,
    //   radius: Math.sqrt(5) * 100,
    // });
  }

  onUnifiedSearchInput(value: string) {
    this.iotSearchTerm = (value || '').trim().toUpperCase();
    this.lastNoMatchSearchTerm = '';
    if (this.showAllMap) {
      this.renderMapDataFromState();
    }
  }

  private hasIotSearch(): boolean {
    return !!this.iotSearchTerm;
  }

  private matchesIotSearch(lockNumber: any): boolean {
    if (!this.hasIotSearch()) {
      return true;
    }
    return String(lockNumber || '').trim().toUpperCase().includes(this.iotSearchTerm);
  }

  private renderMapDataFromState() {
    this.setMapOnAll(null);
    this.markers = [];

    if (!this.isLocate && !this.hasIotSearch()) {
      this.showAllZoneOnMap(this.showAllMap);
    }

    this.allBikeData(this.showAllMap);
  }

  private focusOnMatchedBikeMarkers() {
    const bikeMarkers = (this.markers || []).filter((marker: any) => !!marker?.lock);
    if (!bikeMarkers.length || !this.map) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    bikeMarkers.forEach((marker: any) => {
      const markerPosition = marker.getPosition?.();
      if (markerPosition) {
        bounds.extend(markerPosition);
      }
    });

    this.map.fitBounds(bounds);
    if (bikeMarkers.length === 1) {
      this.map.setZoom(17);
    }
  }

  private showNoMatchWarningIfNeeded() {
    const bikeMarkers = (this.markers || []).filter((marker: any) => !!marker?.lock);
    if (bikeMarkers.length > 0) {
      this.lastNoMatchSearchTerm = '';
      return;
    }

    if (
      this.iotSearchTerm &&
      this.looksLikeIotSearchTerm(this.iotSearchTerm) &&
      this.lastNoMatchSearchTerm !== this.iotSearchTerm
    ) {
      this.lastNoMatchSearchTerm = this.iotSearchTerm;
      this.toastr.warning('No IoT found for searched ID');
    }
  }

  private looksLikeIotSearchTerm(value: string): boolean {
    const normalized = (value || '').trim().toUpperCase();
    return /^[A-Z0-9_-]{3,}$/.test(normalized) && /\d/.test(normalized);
  }
}
