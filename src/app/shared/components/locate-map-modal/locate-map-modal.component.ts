import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MapModalComponent } from '../components';
import { ToastrService } from 'ngx-toastr';
import { ProduceBikeService } from 'src/app/core/services/produceBike/produceBike.service';
import {
  Active,
  Available,
  MapDrawObjectCircle,
  MapDrawObjectPolygon,
  MapDrawObjectRectangle,
  MapZoom,
  UnderMaintenance,
  blackBike,
  blueBike,
  geoOut,
  greenBike,
  redBike,
  yellowBike,
} from 'src/app/core/constants/common-constant';
import { NgxSpinnerService } from 'ngx-spinner';
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
@Component({
  selector: 'app-locate-map-modal',
  templateUrl: './locate-map-modal.component.html',
  styleUrls: ['./locate-map-modal.component.scss'],
})
export class LocateMapModalComponent implements OnInit {
  map: any;
  latlngData;
  zoneAddress;
  public lat;
  public lng;
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
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

  // lat: number;
  zoom: number;
  // lng: number;
  locateLat: number;
  locateLng: number;
  intervals: any;
  subscription: Subscription[] = [];

  latitude: number;
  longitude: number;
  locateMarker: any;

  constructor(
    public dialogRef: MatDialogRef<LocateMapModalComponent>,
    private toastr: ToastrService,
    public ProduceBikeService: ProduceBikeService,
    private spinner: NgxSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  bikeData: any;

  ngOnInit(): void {
    console.log(this.data.pageValue,"check");
    // this.data.pageValue.bikeStatusEnumId ="24"
    // this.data.pageValue.bikeStatusName= UnderMaintenance//"Available"//'Active'
    // this.getCurrentLocation();
    // this.intervals = setInterval(() => {
    //   let latLng = this.getCurrentLocation();

    //   this.getAllLatlng.push(this.latLng);
    //   this.latLng = {
    //     lat: Number(this.latitude),
    //     lng: Number(this.longitude),
    //   };
    // }, 5000);
  }

  drawAreaOrCity() {
    console.log(this.map);
    if (this.data.pageValue) {
      let draw;
      let obj = this.data.pageValue;
      console.log(obj.mapDrawObject, obj, 'chekk');
      // obj.mapDrawObject = obj.areaMapDrawObject || obj.mapDrawObject
      console.log(obj.mapDrawObject);
      if (obj.mapDrawObject !== null && obj.mapDrawObject !== undefined) {
        // obj.mapDrawObjectEnumId = obj.areaMapDrawObjectEnumId || obj.mapDrawObjectEnumId
        // obj.mapDrawObject.center = obj.areaMapDrawObject.center ?? obj.mapDrawObject.center
        this.map.setZoom(12);
        console.log(obj.mapDrawObject.center, 'center', obj);
        this.map.setCenter(obj.mapDrawObject.center);

        // console.log(obj);
        if (obj.mapDrawObjectEnumId == MapDrawObjectCircle) {
          // circle
          // obj.mapDrawObject.radius= obj.areaMapDrawObject.radius || obj.mapDrawObject.radius
          // obj.mapDrawObject.center= obj.areaMapDrawObject.center || obj.mapDrawObject.center

          draw = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            radius: obj.mapDrawObject.radius,
            center: obj.mapDrawObject.center,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: -1,
          });
        }
        if (obj.mapDrawObjectEnumId == MapDrawObjectRectangle) {
          // obj.mapDrawObject.bounds = obj.areaMapDrawObject.bounds||  obj.mapDrawObject.bounds

          // Rectangle
          draw = new google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            bounds: obj.mapDrawObject.bounds,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: -1,
          });
          // this.showInfo(obj, draw); // show info tag
        }
        if (obj.mapDrawObjectEnumId == MapDrawObjectPolygon) {
          //  obj.mapDrawObject.path =  obj.areaMapDrawObject.path || obj.mapDrawObject.path
          // Polygon
          let path = google.maps.geometry.encoding.decodePath(
            obj.mapDrawObject.path
          );
          draw = new google.maps.Polygon({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            path: path,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: -1,
          });
        }
      } else if (
        obj.areaMapDrawObject !== null &&
        obj.areaMapDrawObject !== undefined
      ) {
        console.log(obj.areaMapDrawObject, 'for Area');

        this.map.setZoom(12);
        console.log(obj.areaMapDrawObject.center, 'center', obj);
        this.map.setCenter(obj.areaMapDrawObject.center);

        // console.log(obj);
        if (obj.areaMapDrawObjectEnumId == MapDrawObjectCircle) {
          draw = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            radius: obj.areaMapDrawObject.radius,
            center: obj.areaMapDrawObject.center,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: -1,
          });
        }
        if (obj.areaMapDrawObjectEnumId == MapDrawObjectRectangle) {
          // obj.mapDrawObject.bounds = obj.areaMapDrawObject.bounds||  obj.mapDrawObject.bounds

          // Rectangle
          draw = new google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            bounds: obj.areaMapDrawObject.bounds,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: -1,
          });
          // this.showInfo(obj, draw); // show info tag
        }
        if (obj.areaMapDrawObjectEnumId == MapDrawObjectPolygon) {
          // Polygon
          let path = google.maps.geometry.encoding.decodePath(
            obj.areaMapDrawObject.path
          );
          draw = new google.maps.Polygon({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            path: path,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: -1,
          });
        }
      }
    }
  }

  getLocation: any = [];
  getAllLatlng: any = [];
  latLng: any;
  getCurrentLocation() {
    console.log('check',this.data.pageValue.bikeStatusEnumId);
    this.spinner.show();
    this.subscription.push(
      this.ProduceBikeService.getCurrentLocOfDevice(
        this.data.pageValue.lockNumber
      ).subscribe((res) => {
        if (res.statusCode === 200) {
          this.spinner.hide();
          console.log(res.data);
          this.getLocation = res.data;
          this.latitude = Number(this.getLocation[0].latitude); //Number(this.getLocation[0].latitude) +i
          this.longitude = Number(this.getLocation[0].longitude); //Number(this.getLocation[0].longitude) +i
          this.latLng = {
            lat: Number(this.latitude),
            lng: Number(this.longitude),
          };
          if (!this.locateMarker) {
            this.setMarker();
          } else {
            this.locateMarker.setPosition(this.latLng);
            this.locateMarker.setAnimation(google.maps.Animation.BOUNCE);
            // DROP
          }
          // console.log()
          //  this.locateMarker.setPosition(this.latLng)
          //  this.locateMarker.getAnimation()
        } else if (res.statusCode === 422) {
          this.spinner.hide();
          this.toastr.warning(res.message);
        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );
    this.spinner.hide();
  }

  setMarker() {
    let latLng = {
      lat: Number(this.latitude),
      lng: Number(this.longitude),
    };
    console.log(latLng, 'checkDS',this.map);
    this.map.setCenter(latLng);
    this.locateMarker = new google.maps.Marker({
      position: this.latLng,
      map: this.map,
      icon: '../../../assets/images/bicycle-3.png',
      zIndex: 2,
      clickable: true,
    });
    this.applyMarkerLabelStyle(this.locateMarker);
     
    if(this.data.pageValue.bikeStatusName== Available) this.setBikeIcon(this.locateMarker, blueBike) 
    if(this.data.pageValue.bikeStatusEnumId == Active) this.setBikeIcon(this.locateMarker, greenBike) 
    this.checkBikeOutInAvailble(this.data.pageValue, this.locateMarker)
    this.checkBikeBatterybw25_50(this.data.pageValue, this.locateMarker)
    
    if(this.data.pageValue.bikeStatusEnumId == UnderMaintenance) this.setBikeIcon(this.locateMarker, blackBike) 
   


    let activeInfoWindow;
    let obj = this.data.pageValue;
    this.locateMarker.addListener('click', (mapsMouseEvent) => {
      console.log(obj, 'obj', mapsMouseEvent);
      if (activeInfoWindow) {
        console.log(activeInfoWindow, 'marker');
        activeInfoWindow.close();
      }
      this.latlngData = mapsMouseEvent.latLng.toJSON();
      let infowindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });

      infowindow.close();

      infowindow.setContent(
        `<p class="info-box">
     
      cordinate :${JSON.stringify(obj.latitude)},${JSON.stringify(
          obj.longitude
        )} <br>
      </p>
      `
      );
      infowindow.open(this.map);
      activeInfoWindow = infowindow;
    });
  }

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

    // if (
    //   e.batteryPercentage > 51 &&
    //   this.isbikeRefresh &&
    //   e.geofenceInOutEnumId == geoIn
    // ) {
    //   if (e.bikeStatusName == Active) this.setBikeIcon(bike, greenBike);
    //   else if (e.bikeStatusName == Available) this.setBikeIcon(bike, blueBike);
    //   else if (e.bikeStatusName == UnderMaintenance)
    //     this.setBikeIcon(bike, blackBike);
    // }
    //  else if (
    //   e.batteryPercentage > 51 &&
    //   this.isbikeRefresh &&
    //   e.geofenceInOutEnumId == geoOut
    // ) {
    //   if (e.bikeStatusName == Active) this.setBikeIcon(bike, redBike);
    //   else if (e.bikeStatusName == Available) this.setBikeIcon(bike, redBike);
    //    else if (e.bikeStatusName == UnderMaintenance)this.setBikeIcon(bike, blackBike);
    // }

     if (e.bikeStatusName == UnderMaintenance) this.setBikeIcon(bike, blackBike);
  }

  setBikeIcon(bike, name) {
    let icon = {
      url: `../../../assets/images/${name}`, //'../../../assets/images/bicycle-blue.png',
      labelOrigin: new google.maps.Point(24, -5),
    };
    bike.setIcon(icon);
    this.applyMarkerLabelStyle(bike);
  }

  applyMarkerLabelStyle(marker) {
    const currentLabel = marker?.getLabel?.();
    if (!currentLabel) return;

    if (typeof currentLabel === 'string') {
      marker.setLabel({
        text: currentLabel,
        color: '#000000',
        fontWeight: '700',
      });
      return;
    }

    marker.setLabel({
      ...currentLabel,
      color: '#000000',
      fontWeight: currentLabel.fontWeight || '700',
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  showMap(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    const options = {
      center: location,
      zoom: MapZoom,
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    // const marker = new google.maps.Marker({
    //   position: location,
    //   map: this.map,
    // });
    ///////////////////////////////////Search Address Code/////////////////////////////////////
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );

    autocomplete.bindTo('bounds', this.map);

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.searchElementRef.nativeElement
    );

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = this.infowindowContentElementRef.nativeElement;

    infowindow.setContent(infowindowContent);

    //const marker = new google.maps.Marker({ map:  this.map  });

    // marker.addListener("click", () => {
    //   infowindow.open( this.map , marker);
    // });

    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      const place = autocomplete.getPlace();
      this.zoneAddress = place;
      if (this.zoneAddress) {
        const zoneFormData: any = {
          address: this.zoneAddress.formatted_address,
          stateCity: this.zoneAddress.address_components,
        };
        // this.nameEmitter.emit(zoneFormData );  s
      }

      if (!place.geometry || !place.geometry.location) {
        return;
      }
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
      // Set the position of the marker using the place ID and location.
      // @ts-ignore This should be in @typings/googlemaps.
      // marker.setPlace({
      //   placeId: place.place_id,
      //   location: place.geometry.location,
      // });
      // marker.setVisible(true);
      // infowindow.open( this.map , marker);
    });
  }
  showLatLng() {
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

            //  this.latlngEmitter.emit(this.latlngData);
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

  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          this.showMap(this.lat, this.lng);

          this.map = new google.maps.Map(this.mapRef.nativeElement, {
            center: { lat: this.lat, lng: this.lng }, //{ lat: 44.5452, lng: -78.5389 },
            zoom: MapZoom,
          });
          this.drawAreaOrCity();
        }
      });
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervals);
  }

  addressDetail:any
  // bikeData:any
  receivename(e){
    console.log(e)
  }
  zoneIdByDetail(e){
    console.log(e)
  }
  

  
}
