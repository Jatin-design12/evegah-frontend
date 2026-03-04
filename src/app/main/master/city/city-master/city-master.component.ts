import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import {
 CityMapZoom,
  AreafillColor,
  CityfillColor,
  DataNotAvailable,
  MapDrawObjectCircle,
  MapDrawObjectPolygon,
  MapDrawObjectRectangle,
  MapZoom,
} from 'src/app/core/constants/common-constant';
import { IGetCityData } from 'src/app/core/interfaces/common/city-data';
import { IGetStateData } from 'src/app/core/interfaces/common/state-data';
import { ModelArea } from 'src/app/core/models/master/areaModel';
import { ModelCity } from 'src/app/core/models/master/cityModel';

import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { CommonService } from 'src/app/core/services/common.services';
import { AreaService } from 'src/app/core/services/master/area/area.service';
import { CityMasterService } from 'src/app/core/services/master/city/city-master.service';

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
  selector: 'app-city-master',
  templateUrl: './city-master.component.html',
  styleUrls: ['./city-master.component.scss']
})
export class CityMasterComponent implements OnInit, OnDestroy {
  heading: any = 'Create City';
  cityMasterForm: FormGroup;
  subscription: Subscription[] = [];
  userData: any;
  viewMode: boolean = false;
  editMode: boolean = false;
  areaCheck: any = {};
  cityModel=new ModelCity();
  // map
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
  geoCoder: any;
  map: any;
  lat: number;
  lng: number;
  @ViewChild('delete', { read: ElementRef, static: false })
  deleteRef: ElementRef;
  @ViewChild('address', { read: ElementRef, static: false })
  addressRef: ElementRef;
  @ViewChild('deleteEdit', { read: ElementRef, static: false })
  deleteEditRef: ElementRef;
  @ViewChild('getAdd', { read: ElementRef, static: false })
  addRef: ElementRef;

  zoneAddress: any;
  cordinateData: any;
  myselectedPath: any = [];
  latlngData: any;
  mapInfo: any = [];
  dManager: any;
  draw: any;
  isAreaDelete: boolean = true;

  constructor(
    public activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrService,
    public formBuilder: FormBuilder,
    public router: Router,
    private AreaService: AreaService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private cityService:CityMasterService
  ) {
    var mapdd: any;
    this.geoCoder = new google.maps.Geocoder();
    this.cityMasterForm = this.formBuilder.group({
      // stateId: ['', [Validators.required]],
      // cityId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      areaId: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user'));
    this.areaCheck = JSON.parse(sessionStorage.getItem('areaData'));
    this.cityMasterForm = this.formBuilder.group({
      // stateId: ['', [Validators.required]],
      // cityId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      // areaId: ['', [Validators.required]],
      // address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });

  }
 
  // back to list
  backButton() {
    this.router.navigate(['./main/master/city']);
  }
  cancel() {
    // this.cityMasterForm.reset();
    this.router.navigate(['./main/master/city']);
  }

  

  saveArea() {
    console.log(this.cityMasterForm)
    if (this.cityMasterForm.valid) {
      if (this.editMode) {
        this.cityModel.mapCityId = this.areaCheck.mapCityId;
      } else {
        this.cityModel.mapCityId = 0;
      }

      console.log(this.mapInfo, 'mapInfo', this.addressDetail);
      let data: any =
        JSON.parse(sessionStorage.getItem('AreaCircleData')) ||
        JSON.parse(sessionStorage.getItem('AreaRectData')) ||
        JSON.parse(sessionStorage.getItem('AreaPolygonData'));
      console.log(data);
     console.log(this.cityMasterForm.value.name)
        this.cityModel.userCityName =this.cityMasterForm.value.name,
  
        (this.cityModel.statusEnumId = 1),
        (this.cityModel.createdById = this.userData.id);
      // If Adress not set
      if (Object.keys(this.addressDetail).length == 0) {
        // this.cityMasterForm.controls.address.setValue('');
        this.cityMasterForm.controls.city.setValue('');
        this.cityMasterForm.controls.state.setValue('');
        this.toastr.warning('Please Set the Address and City');
        return;
      }

      if (this.editMode) {
        console.log(this.mapInfo, 'mapInfo', this.addressDetail);
        let isChange = JSON.parse(sessionStorage.getItem('isChange'));
        console.log(isChange, 'save ');
        if (isChange) {
          // this.cityMasterForm.controls.address.setValue('');
          this.cityMasterForm.controls.city.setValue('');
          this.cityMasterForm.controls.state.setValue('');
          this.toastr.warning(
            'Please Set the New Address, On Click Get Address Button '
          );
          return;
        }

        // EdIT MODE WHEN NO CHANGE ON DRAWING
        if (this.addressDetail.mapDrawObjectAddress) {
          this.addressDetail.country =
            this.addressDetail.mapDrawObjectAddress.country;
          this.addressDetail.state = this.addressDetail.mapStateName;
          this.addressDetail.city = this.addressDetail.mapCityName;
          this.addressDetail.placeId = this.addressDetail.placeId;
          this.addressDetail.pincode =
            this.addressDetail.mapDrawObjectAddress.pincode;
          this.addressDetail.address = this.addressDetail.fullAddress;
        }

        this.cityModel.mapCountryName = this.addressDetail.country;
        this.cityModel.mapStateName = this.addressDetail.state;
        this.cityModel.mapCityName = this.addressDetail.city;

        this.cityModel.placeId = this.addressDetail.placeId;
        this.cityModel.pinCode = this.addressDetail.pincode;
        this.cityModel.fullAddress = this.addressDetail.address;
        if (data == null) {
          //
          data = this.addressDetail.mapDrawObject;
        }
        if (data.id == null) {
          data.id = this.addressDetail.mapDrawObjectEnumId;
        }
        this.cityModel.mapDrawObjectEnumId = data.id; //? this.addressDetail.mapDrawObjectEnumId;
        this.cityModel.mapDrawObject = data; //? this.addressDetail.mapDrawObject;
        this.cityModel.mapDrawObjectAddress = this.addressDetail;
      } 
      else {
        this.cityModel.mapCountryName = this.addressDetail.country;
        this.cityModel.mapStateName = this.addressDetail.state;
        this.cityModel.mapCityName = this.addressDetail.city;

        this.cityModel.placeId = this.addressDetail.placeId;
        this.cityModel.PinCode = this.addressDetail.pincode;
        this.cityModel.pinCode= this.addressDetail.pincode;
        this.cityModel.fullAddress = this.addressDetail.address;
        this.cityModel.mapDrawObjectEnumId = data.id;
        this.cityModel.mapDrawObject = data;
        this.cityModel.mapDrawObjectAddress = this.addressDetail;
      }

      if(data.id == MapDrawObjectCircle){
        console.log(data,"data")
        this.cityModel.center= data.center1//[22.721231275904092, 75.85573023649293],
        this.cityModel.radius= data.radius//268.47648648346586
      }
      
       if(data.id == MapDrawObjectRectangle){
          this.cityModel.sw=data.sw//[22.665891269711715,75.88826734671392],
          this.cityModel.ne=data.ne//[22.699151984636835,75.9425123418311]
        }

     if(data.id == MapDrawObjectPolygon){
    let polygon2=  this.getPolygonFormat(data.polygonpoint)
          this.cityModel.polygonpoint=data.polygonpoint//[[22.72036,75.847748], [22.721231, 75.849508], [22.721865, 75.851396], [22.721152, 75.852383], [22.720479, 75.853456], [22.719292 ,75.85204], [22.720558 ,75.85161],[22.719806 ,75.850065],[22.7204, 75.84895]],
          this.cityModel.polygonpoint2=`POLYGON((${polygon2}))`//data.polygonpoint//"POLYGON((22.72036 75.847748,22.721231 75.849508,22.721865 75.851396,22.721152 75.852383,22.720479 75.853456,22.719292 75.85204,22.720558 75.85161,22.719806 75.850065,22.7204 75.84895,22.72036 75.847748))"
        }

  
      console.log(this.cityModel);
      // return
      this.subscription.push(
        this.cityService.addUpdateCity(this.cityModel).subscribe((res) => {
          if (res.statusCode === 200) {
            this.toastr.success(res.message);
            this.backButton();
          } else {
            this.toastr.warning(res.message);
          }
        })
      );
    }else{
      this.cityMasterForm.markAllAsTouched()
    }
  }

  getPolygonFormat(data){
let arr= []
let first
  data.forEach((e,i)=>{
    first = `${e[0]} ${e[1]}`
   let check= e.toString()
 let check1=  check.replace(","," ")
   console.log(check1)
   arr.push(check1)
  })
  arr.unshift(first)
 let final= arr.toString()
  console.log(final ,"firn")
  return final



  }

  checkMode() {
    if (this.areaCheck !== null) {
      if (this.areaCheck.mode === 'edit') {
        this.editMode = true;
        this.heading = 'Edit City :  ' + this.areaCheck.userCityName  ;
      } else {
        this.viewMode = true;
        this.heading = 'View City : ' + this.areaCheck.userCityName  ;
      }
      this.setFormValue();
    }
  }
  setFormValue() {
    console.log(
      this.areaCheck,
      'ststusEnumId',
      'this.bodyColorData.statusEnunId'
    );
    this.cityMasterForm.patchValue({
      name: this.areaCheck.userCityName  ,
      // stateId: String(this.areaCheck.stateId),
      // cityId: Number(this.areaCheck.cityId),
      // areaId: this.areaCheck.areaTypeEnumId,
      state: this.areaCheck.mapStateName,
      city: this.areaCheck.mapCityName,
      // address: this.areaCheck.fullAddress,
    });

    this.showMaps(this.map);
    this.addressDetail = this.areaCheck;

    if (this.viewMode) {
      this.cityMasterForm.disable();
    }
  }

  showMaps(map) {
    let change = false;

    console.log(this.dManager, 'dManager');
    this.dManager.setMap(null);
    const Data = sessionStorage.getItem('areaData');
    // const rectData = sessionStorage.getItem('rectData');
    // const polygonData = sessionStorage.getItem('polygonData');
    // const polylineData = sessionStorage.getItem('polylineData');
    // const markerData = sessionStorage.getItem('markerData');

    let draw;
    if (Data) {
      change = false;
      const obj = JSON.parse(Data);
      this.map.setZoom(CityMapZoom);
      if (obj.mapDrawObjectEnumId == MapDrawObjectCircle) {
        // circle
        draw = new google.maps.Circle({
          strokeColor: CityfillColor,//'#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: CityfillColor,//'#FF0000',
          fillOpacity: 0.35,
          map,
          radius: obj.mapDrawObject.radius,
          center: obj.mapDrawObject.center,
          clickable: true,
          editable: true,
          draggable: true,
          zIndex: 1,
        });
        [
          // 'bounds_changed' ,
          'radius_changed',
          'center_changed',
          'dragstart',
          'drag',
          'dragend',
        ].forEach((eventName) => {
          google.maps.event.addListener(draw, eventName, function () {
            console.log(draw.getRadius());
            const center = draw.getCenter();
            const radius = draw.getRadius();
            const obj: any = {
              id: MapDrawObjectCircle,
              center: center,
              radius: radius,
              event: draw.getBounds(),
             'center1':[center.lat(),center.lng()],
              isChange: true,
            };
            change = true;
            sessionStorage.setItem('isChange', JSON.stringify(true));
            let dataObj = JSON.stringify(obj);
            sessionStorage.setItem('AreaCircleData', dataObj);
          });
        });
        if (this.viewMode) {
          draw.clickable = false;
          draw.editable = false;
        }
      }

      if (obj.mapDrawObjectEnumId == MapDrawObjectRectangle) {
        // Rectangle
        draw = new google.maps.Rectangle({
          strokeColor: CityfillColor,//'#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: CityfillColor,//'#FF0000',
          fillOpacity: 0.35,
          map,
          bounds: obj.mapDrawObject.bounds,
          clickable: true,
          editable: true,
          draggable: true,
          zIndex: 1,
        });

        // When edit and change the draw
        ['bounds_changed', 'dragstart', 'drag', 'dragend'].forEach(
          (eventName) => {
            google.maps.event.addListener(draw, eventName, function () {
              const ne = draw.getBounds().getNorthEast();
              const sw = draw.getBounds().getSouthWest();
              let bounds = {
                id: MapDrawObjectRectangle,
                bounds: draw.getBounds(),
                centerLat: draw.getBounds().getCenter().lat(),
                centerLng: draw.getBounds().getCenter().lng(),
                'ne':[ne.lat(),ne.lng()],
                'sw':[sw.lat(),sw.lng()],
                center:draw.getBounds().getCenter()
              };
              sessionStorage.setItem('isChange', JSON.stringify(true));

              let dataObj = JSON.stringify(bounds);
              sessionStorage.setItem('AreaRectData', dataObj);
            });
          }
        );
        if (this.viewMode) {
          draw.clickable = false;
          draw.editable = false;
        }
      }
      if (obj.mapDrawObjectEnumId == MapDrawObjectPolygon) {
        // Polygon
        let path = google.maps.geometry.encoding.decodePath(
          obj.mapDrawObject.path
        );
        draw = new google.maps.Polygon({
          strokeColor: CityfillColor,//'#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: CityfillColor,//'#FF0000',
          fillOpacity: 0.35,
          map,
          path: path,
          clickable: true,
          editable: true,
          draggable: true,
          zIndex: 1,
        });
        [
          'resize',
          'set_at',
          'insert_at',
          'remove_at',
          'coordinates_changed',
          'dragstart',
          'drag',
          'dragend',
        ].forEach((eventName) => {
          google.maps.event.addListener(draw.getPath(), eventName, function () {
            console.log(eventName, 'eventName');
            let coordinates: any = [];
            let new_coordinates:any =[]
            var len = draw.getPath().getLength();

            for (var i = 0; i < len; i++) {
              coordinates.push(draw.getPath().getAt(i).toUrlValue(14));
              let cor= (draw.getPath().getAt(i).toUrlValue(14))
                let check:Array<number>=   cor.split(",")

                let newArra:Array<number>=[]
                check.forEach(e=>{
                  newArra.push(Number(e))
                })
                new_coordinates.push(newArra);
                    }
            let center= draw.getPath().getArray().reduce((prev, curr) => prev.extend(curr), new google.maps.LatLngBounds());
        let polygonCenter={
          lat:center.getCenter().lat(),
          lng:center.getCenter().lng()
        }
            //console.logcoordinates, 'coordinates');
            let path = {
              id: MapDrawObjectPolygon,
              path: google.maps.geometry.encoding.encodePath(draw.getPath()),
              coordinates: coordinates,
              center:polygonCenter,
              polygonpoint:new_coordinates,
              polygonpoint2:new_coordinates//POLYGON()
              // event:event
            };
            sessionStorage.setItem('isChange', JSON.stringify(true));

            // array.unshift(path);
            //console.logthis.polygonData2, path);
            sessionStorage.setItem('AreaPolygonData', JSON.stringify(path));
          });
        });

        // draw.getPath().addListener('set_at', someFunction);
        if (this.viewMode) {
          draw.clickable = false;
          draw.editable = false;
        }
      }

      // this.dManager.setMap(map)
    }

    this.draw = draw;
  }

  reset() {
    this.cityMasterForm.reset();
  }

  delete() {
    if (this.draw) {
      this.draw.setMap(null);
    }
    // this.cityMasterForm.controls.address.setValue("")
    this.cityMasterForm.controls.city.setValue("")
    this.cityMasterForm.controls.state.setValue("")
    this.dManager.setMap(this.map);
    this.isAreaDelete = !this.isAreaDelete;
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('AreaDrawData');
    sessionStorage.removeItem('areaData');
    sessionStorage.removeItem('AreaCircleData');
    sessionStorage.removeItem('AreaRectData');
    sessionStorage.removeItem('AreaMarkerData');
    sessionStorage.removeItem('AreaPolylineData');
    sessionStorage.removeItem('AreaPolygonData');
    sessionStorage.removeItem('isChange');

    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  ngAfterViewInit() {
    this.initMap();
    this.checkMode();
    this.cd.detectChanges();
  }

  initMap(): void {
    var coordinates: any = [];
    var new_coordinates:any =[]
    var new_coordinates2:Array<any> =[]


    let array: any = [];
    let arrayCircle: any = [];
    let arrayPolyline: any = [];
    let arrayRect: any = [];
    let arrayMarker: any = [];

    var all_overlays = [];
    var selectedShape;

    var polygonEvent;
    var circleEvent;
    var rectEvent;
    var map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }

        const myLatLng = { lat: this.lat, lng: this.lng };
      });
    }

    this.showMap(22.7195687, 75.8577258); // Search Enable

    let data = sessionStorage.getItem('areaData');
    if (data) {
      let obj = JSON.parse(data);
      if (obj.mapDrawObjectEnumId == MapDrawObjectCircle) {
        // circle

        let radius = obj.mapDrawObject.radius;
        let center = obj.mapDrawObject.center;

        this.lat = center.lat;
        this.lng = center.lng;
        //console.log(this.lat, this.lng, 'center', center);
      }
      if (obj.mapDrawObjectEnumId == MapDrawObjectRectangle) {
        // Rectangle

        this.lat = obj.mapDrawObject.centerLat;
        this.lng = obj.mapDrawObject.centerLng;
        //console.log(this.lat, this.lng, 'center');
      }
      if (obj.mapDrawObjectEnumId == MapDrawObjectPolygon) {
        // Polygon
        //console.log(obj, 'obj');
        // let latLng = obj.mapDrawObject.coordinates[0].toString();

        // let lanLngArr = latLng.split(',');
        //console.log(lanLngArr, 'lanLanArr');
        const latlng = {
                lat: parseFloat(obj.mapDrawObject.center.lat),//parseFloat(coordinate[0]),
                lng: parseFloat(obj.mapDrawObject.center.lng)//)parseFloat(coordinate[1]), //parseFloat(latlngStr[1]),
              };
        this.lat = latlng.lat,//Number(lanLngArr[0]);
        this.lng = latlng.lng//Number(lanLngArr[1]);
        // this.lat=
      }
    }
    if (this.lat == undefined && this.lng == undefined) {
      (this.lat = 22.7195687), (this.lng = 75.8577258);
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      center: {
        lat: this.lat,
        lng: this.lng,
      }, //{ lat: 44.5452, lng: -78.5389 },
      zoom:CityMapZoom,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true
    });

    map = this.map;
    let drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.NULL,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
        drawingModes: [
          // google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          // google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      markerOptions: {
        // icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        clickable: true,
        icon: "'../../../../../assets/images/evegah_green.ico",
        // editable: true,
        draggable: true,
        zIndex: 1,
      },
      circleOptions: {
        fillColor: CityfillColor,// '#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
      polygonOptions: {
        path: this.myselectedPath,
        fillColor: CityfillColor,//'#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
      rectangleOptions: {
        fillColor: CityfillColor,//'#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
    });
    this.dManager = drawingManager;

    drawingManager.setMap(this.map);

    google.maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      function (event) {
        //console.log(event.getPath());
        this.polygonEvent = event;
        polygonEvent = event;
        google.maps.event.addListener(
          event,
          'dragend',
          getPolygonCoords(event)
        );

        google.maps.event.addListener(
          event.getPath(),
          'insert_at',
          function () {
            getPolygonCoords(event);
          }
        );

        google.maps.event.addListener(event.getPath(), 'set_at', function () {
          getPolygonCoords(event);
        });

        let center=event.getPath().getArray().reduce((prev, curr) => prev.extend(curr), new google.maps.LatLngBounds());
        let polygonCenter={
          lat:center.getCenter().lat(),
          lng:center.getCenter().lng()
        }
// 
        // console.log(center.getCenter().lat(), 'lat');
        // console.log(center.getCenter().lng(), 'lng');
       

        let path = {
          id: MapDrawObjectPolygon,
          path: google.maps.geometry.encoding.encodePath(event.getPath()),
          coordinates: coordinates,
          center:polygonCenter,
          polygonpoint:new_coordinates,
          polygonpoint2:new_coordinates//POLYGON()
          // event:event
        };

        array.unshift(path);
        sessionStorage.setItem('AreaPolygonData', JSON.stringify(path));
        drawingManager.setMap(null);
      }
    );

    google.maps.event.addListener(
      drawingManager,
      'circlecomplete',
      function (circle) {
        //console.log(circle, 'circle', circle.getBounds());
        circleEvent = circle;
        const center = circle.getCenter();
        const radius = circle.getRadius();
        const obj: any = {
          id: MapDrawObjectCircle,
          center: center,
          radius: radius,
          event: circle.getBounds(),
          'center1':[center.lat(),center.lng()],
          // 'radius':radius,
        };
        arrayCircle.unshift(obj);
        let data = JSON.stringify(arrayCircle);
        let dataObj = JSON.stringify(obj);

        this.mapInfo = obj; //JSON.stringify(obj)
        sessionStorage.setItem('AreaCircleData', dataObj);
        // sessionStorage.setItem('AreaCircleData',data );
        drawingManager.setMap(null);
        const geocoder = new google.maps.Geocoder();
        // geocodeLatLng(geocoder, this.map, infowindow);
        // if (circleData) {

        const latlng = {
          lat: parseFloat(obj.center.lat()),
          lng: parseFloat(obj.center.lng()), //parseFloat(latlngStr[1]),
        };
      }
    );

    google.maps.event.addListener(
      drawingManager,
      'rectanglecomplete',
      function (event) {
        rectEvent = event;
        console.log(event.getBounds(),"rectangle")
        // //console.log(event.getBounds().getCenter().lat(), 'lat');
        // //console.log(event.getBounds().getCenter().lng(), 'lng');
        // //console.log(rectangle.getBounds().getCenter().toJSON());
        const ne = event.getBounds().getNorthEast();
        const sw = event.getBounds().getSouthWest();
        let bounds = {
          id: MapDrawObjectRectangle,
          bounds: event.getBounds(),
          centerLat: event.getBounds().getCenter().lat(),
          centerLng: event.getBounds().getCenter().lng(),
          'ne':[ne.lat(),ne.lng()],
          'sw':[sw.lat(),sw.lng()],
          center:event.getBounds().getCenter()
          // event:event
        };
        arrayRect.unshift(bounds);
        sessionStorage.setItem('AreaRectData', JSON.stringify(bounds));
        const latlng = {
          lat: bounds.centerLat,
          lng: bounds.centerLng, //parseFloat(latlngStr[1]),
        };
        // getCircleAddress(latlng)
        drawingManager.setMap(null);
      }
    );

    google.maps.event.addListener(
      drawingManager,
      'polylinecomplete',
      function (event) {
        const path = google.maps.geometry.encoding.encodePath(event.getPath());
        arrayPolyline.push(path);
        sessionStorage.setItem('polylineData', JSON.stringify(arrayPolyline));
      }
    );

    google.maps.event.addListener(
      drawingManager,
      'markercomplete',
      function (event) {
        const path = event.getPosition();
        arrayMarker.unshift(path);
        sessionStorage.setItem('markerData', JSON.stringify(arrayMarker));
      }
    );

    var getPolygonCoords = function (newShape) {
      coordinates.splice(0, coordinates.length);
      new_coordinates.splice(0, new_coordinates.length);
      new_coordinates2.splice(0, new_coordinates.length);

      var len = newShape.getPath().getLength();

      for (var i = 0; i < len; i++) {
        coordinates.push(newShape.getPath().getAt(i).toUrlValue(14));

        let cor= (newShape.getPath().getAt(i).toUrlValue(14))
        let check:Array<number>=   cor.split(",")
        let check2:Array<number>=   cor.replace(","," ")

        console.log(check2)
        let newArra:Array<number>=[]
        check.forEach(e=>{
          newArra.push(Number(e))
        })
        new_coordinates.push(newArra);
      new_coordinates2.push(check2);

      }



      // document.getElementById('map').innerHTML = coordinates
      console.log(coordinates, new_coordinates, 'coordinates', new_coordinates2,);
    };

    let bounds = {
      north: 22.7195687, //lng: 75.8577258
      south: 22.9195687,
      east: -75.8577258,
      west: 75.9577258,
    };

    // Define a rectangle and set its editable property to true.
    const rectangle = new google.maps.Rectangle({
      bounds: bounds,
      editable: true,
      draggable: true,
    });

    ['bounds_changed', 'dragstart', 'drag', 'dragend'].forEach((eventName) => {
      rectangle.addListener(eventName, () => {
        //console.log({ bounds: rectangle.getBounds()?.toJSON(), eventName });
        this.cordinateData = rectangle.getBounds()?.toJSON();
      });
    });

    function clearSelection() {
      if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
      }
    }
    //to disable drawing tools
    function stopDrawing() {
      // drawingManager.setMap(null);
      // drawingManager.setMap(this.map);
    }

    function setSelection(shape) {
      clearSelection();
      stopDrawing();
      // drawingManager.setMap(this.map)
      selectedShape = shape;
      shape.setEditable(true);
    }

    function deleteSelectedShape() {
      if (selectedShape) {
        selectedShape.setMap(null);
        sessionStorage.removeItem('AreaCircleData');
        sessionStorage.removeItem('AreaRectData');
        sessionStorage.removeItem('AreaMarkerData');
        sessionStorage.removeItem('AreaPolylineData');
        sessionStorage.removeItem('AreaPolygonData');
        // drawingManager.setMap(this.map);
        coordinates.splice(0, coordinates.length);
        // document.getElementById('map').innerHTML = ""
      }
      drawingManager.setMap(map);
    }

    function CenterControl(controlDiv, map) {
      // Set CSS for the control border.
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginBottom = '22px';
      controlUI.style.marginTop = '10px';
      controlUI.style.marginRight = '10px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Select to delete the shape';
      controlUI.className = 'setbtn';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement('button');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.fontSize = '16px';
      controlText.style.lineHeight = '22px';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = 'Delete Shape';
      controlText.className = 'btn btn-default ';

      controlUI.appendChild(controlText);

      //to delete the Draw
      controlUI.addEventListener('click', function () {
        deleteSelectedShape();
      });
    }

    this.deleteRef.nativeElement.addEventListener('click', function () {
      deleteSelectedShape();
      //console.log(this.areaMasterForm,"fporm")
      //  this.cityMasterForm.reset()

    });
    // this.deleteEditRef.nativeElement.addEventListener('click', function () {
    //   deleteSelectedShape();
    //   //console.log(this.areaMasterForm,"fporm")
    //    this.cityMasterForm.reset()
    // });

    google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      function (event) {
        all_overlays.push(event);
        //console.log(event, this.cityMasterForm, 'this.cityMasterForm');
        if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          drawingManager.setDrawingMode(null);

          var newShape = event.overlay;
          newShape.type = event.type;
          google.maps.event.addListener(newShape, 'click', function () {
            setSelection(newShape);
          });
          setSelection(newShape);
        }
        // drawingManager.setMap(null);

        // const geocoder = new google.maps.Geocoder();
        // const infowindow = new google.maps.InfoWindow();
        // geocodeLatLng(geocoder, this.map, infowindow);
      }
    );

    var centerControlDiv: any = document.createElement('div');

    var centerControl = new CenterControl(centerControlDiv, this.map);

    centerControlDiv.index = 1;
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      // centerControlDiv
    );

    // ----------------------------  On map clicl get lat and lng---- start
    // const infowindow = new google.maps.InfoWindow();
    // const infowindowContent = this.infowindowContentElementRef.nativeElement;
    // infowindow.setContent(infowindowContent);

    // this.map.addListener('click', (mapsMouseEvent) => {
    //   this.latlngData = mapsMouseEvent.latLng.toJSON();
    //   let infowindow = new google.maps.InfoWindow({
    //     position: mapsMouseEvent.latLng,
    //   });

    //   //console.log(this.latlngData);
    //   infowindow.close();
    //   infowindow.setContent(
    //     JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    //   );
    //   infowindow.open(this.map);
    // });
  }

  setAddressForm(): void {
    //console.log(this.cityMasterForm.value);
    this.cityMasterForm.controls.city.setValue(this.addressDetail.city);
    this.cityMasterForm.controls.state.setValue(this.addressDetail.state);
    // this.cityMasterForm.controls.address.setValue(this.addressDetail.address);
  }

  address: any = {};
  addressDetail: any = {};
  showAddress: boolean = false;
  getAddress() {
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();
    this.geocodeLatLng(geocoder, this.map, infowindow);
  }

  geocodeLatLng(geocoder, map, infowindow) {
    let circleData: any = JSON.parse(sessionStorage.getItem('AreaCircleData'));
    const rectData = JSON.parse(sessionStorage.getItem('AreaRectData'));
    const polygonData = JSON.parse(sessionStorage.getItem('AreaPolygonData'));
    const markerData = JSON.parse(sessionStorage.getItem('markerData'));

    if (circleData) {
      const latlng = {
        lat: circleData.center.lat,
        lng: circleData.center.lng, //parseFloat(latlngStr[1]),
      };
      this.setAddressInForm(geocoder, latlng);
    } else if (rectData) {
      const latlng = {
        lat: rectData.centerLat,
        lng: rectData.centerLng, //parseFloat(latlngStr[1]),
      };

      this.setAddressInForm(geocoder, latlng);
    } else if (polygonData) {
      console.log(polygonData)
      let coordinate = polygonData.coordinates[0].split(',');
      // console.log(coordinate[0], coordinate[1]);
      const latlng = {
        lat: parseFloat(polygonData.center.lat),//parseFloat(coordinate[0]),
        lng: parseFloat(polygonData.center.lng)//)parseFloat(coordinate[1]), //parseFloat(latlngStr[1]),
      };

      this.setAddressInForm(geocoder, latlng);
    } else if (markerData) {
      const latlng = {
        lat: markerData[0].lat,
        lng: markerData[0].lng, //parseFloat(latlngStr[1]),
      };

      this.setAddressInForm(geocoder, latlng);
    }
  }

  setAddressInForm(geocoder, latlng) {
    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          // map.setZoom(15);

          // const marker = new google.maps.Marker({
          //   position: latlng,
          //   map: map,
          // });
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

          // this.cityMasterForm.patchValue({
          //   city: this.addressDetail.city,

          // });
          // this.cityMasterForm.setValue(this.addressDetail);
          this.cityMasterForm.controls.city.setValue(this.addressDetail.city);
          this.cityMasterForm.controls.state.setValue(this.addressDetail.state);
          // this.cityMasterForm.controls.address.setValue(
          //   this.addressDetail.address
          // );

          sessionStorage.setItem('isChange', JSON.stringify(false));

          console.log(this.addressDetail, 'getAddress()');

          // infowindow.setContent(response.results[0].formatted_address);
          // infowindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      })
      .catch((e) => window.alert('Geocoder failed due to: ' + e));
  }

  showMap(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    const options = {
      center: location,
      zoom: MapZoom,
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });
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

    marker.addListener('click', () => {
      infowindow.open(this.map, marker);
    });

    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      const place = autocomplete.getPlace();
      this.zoneAddress = place;
      // console.log(this.zoneAddress,"search result")
      if (this.zoneAddress) {
        const zoneFormData: any = {
          address: this.zoneAddress.formatted_address,
          stateCity: this.zoneAddress.address_components,
          address_components: this.zoneAddress.address_components,
        };

        this.getAllAreaDraw(zoneFormData);
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
      marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location,
      });
      marker.setVisible(true);
      infowindow.open(this.map, marker);
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
            zoom: MapZoom,
            disableDefaultUI: false,
          };
          // this.map = new google.maps.Map(this.mapRef.nativeElement,options)
          // this.map = new google.maps.Map(this.mapRef.nativeElement, options);
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

  showAllMap: any = [];
  getAllAreaDraw(data) {
    this.address = data;

    let locality: any = this.address.address_components.filter((c) => {
      if (c.types.includes('locality')) return c.long_name;
    });

    let administrative_area_level_3: any =
      this.address.address_components.filter((c) => {
        if (c.types.includes('administrative_area_level_3')) return c.long_name;
      });
    let administrative_area_level_2 = this.address.address_components.filter(
      (c) => {
        if (c.types.includes('administrative_area_level_2')) return c.long_name;
      }
    );
    let administrative_area_level_1 = this.address.address_components.filter(
      (c) => {
        if (c.types.includes('administrative_area_level_1')) return c.long_name;
      }
    );
    let country = this.address.address_components.filter((c) => {
      if (c.types.includes('country')) return c.long_name;
    });
    let postal_code = this.address.address_components.filter((c) => {
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
      state: this.addressDetail.state , //"Madhya Pradesh",
      city: this.addressDetail.city, //'Dewas',
      dataFor: 'ForMapSearch',
    };
    console.log(obj,"ccheck")
    this.subscription.push(
      this.cityService.getCityDetailBySearch(
        obj.country,
        obj.state,
        obj.city,
        obj.dataFor
      ).subscribe((res) => {
        if (res.statusCode === 200) {
          this.showAllMap = res.data;
          this.showAllAreaOnMap(this.showAllMap);
          // console.log(res.data, 'sreach Area Data');
        } else {
          // this.toastr.warning(res.message);
        }
      })
    );
  }

  showAllAreaOnMap(Data) {
    let map = this.map;
    if (Data) {
      Data.forEach((obj) => {
        if(obj.mapDrawObject){

        
        // this.map.setCenter(place.geometry.location);
        // this.map.setZoom(MapZoom);
        this.map.setCenter(obj.mapDrawObject.center)
        console.log(obj);
        if (obj.mapDrawObjectEnumId == MapDrawObjectCircle) {
          // circle
          let draw = new google.maps.Circle({
            strokeColor: AreafillColor,//'#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: AreafillColor,
            fillOpacity: 0.35,
            map,
            radius: obj.mapDrawObject.radius,
            center: obj.mapDrawObject.center,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: 1,
          });

          this.showInfoSearch(obj, draw); // show info tag

          if (this.viewMode) {
            draw.clickable = false;
            draw.editable = false;
          }
        }
        if (obj.mapDrawObjectEnumId == MapDrawObjectRectangle) {
          // Rectangle
          console.log(obj.mapDrawObjectEnumId,"check", obj.mapDrawObject)
          let draw = new google.maps.Rectangle({
            strokeColor: AreafillColor,//'#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: AreafillColor,//'#FF0000',
            fillOpacity: 0.35,
            map:this.map,
            bounds: obj.mapDrawObject.bounds,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: 1,
          });
          this.showInfoSearch(obj, draw); // show info tag

          if (this.viewMode) {
            draw.clickable = false;
            draw.editable = false;
          }
        }
        if (obj.mapDrawObjectEnumId === MapDrawObjectPolygon) {
          // Polygon
          let path = google.maps.geometry.encoding.decodePath(
            obj.mapDrawObject.path
          );
          let draw = new google.maps.Polygon({
            strokeColor: AreafillColor,//'#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: AreafillColor,//'#FF0000',
            fillOpacity: 0.35,
            map,
            path: path,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: 1,
          });
          this.showInfoSearch(obj, draw); // show info tag

          if (this.viewMode) {
            draw.clickable = false;
            draw.editable = false;
          }
        }
      }
      });

      // this.dManager.setMap(map)

      // this.draw.addListener('click', () => {
      //   infowindow.open(this.map, marker);
      // });
    }
  
  }

  reloadPage() {
    window.location.reload();
  }

  showInfo(obj, draw) {
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = this.infowindowContentElementRef.nativeElement;
    infowindow.setContent(infowindowContent);
    let activeInfoWindow 

    // onload when search the location for Circle
    if (obj.mapDrawObjectEnumId == MapDrawObjectCircle) {
      
      let infowindow = new google.maps.InfoWindow({
        position: obj.mapDrawObject.center,
      });
      infowindow.setContent(
        // JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        `<p> Area name : ${JSON.stringify(obj.name)} <br>
        Area Type : ${JSON.stringify(obj.areaType)} <br>
        City Name : ${JSON.stringify(obj.mapCityName)}</p>`
      );
      infowindow.open(this.map);
    }

    draw.addListener('click', (mapsMouseEvent) => {

      console.log(obj, 'obj');
      if (activeInfoWindow) {
        console.log(activeInfoWindow, 'marker');
        activeInfoWindow.close();
      }
      this.latlngData = mapsMouseEvent.latLng.toJSON();
      let infowindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });

      infowindow.close();
      // const infowindowContent = this.infowindowContentElementRef.nativeElement;

      // infowindow.setContent(infowindowContent);
      infowindow.setContent(
        // JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        `<p> Area name : ${JSON.stringify(obj.name)} <br>
        Area Type : ${JSON.stringify(obj.areaType)} <br>
        City Name : ${JSON.stringify(obj.mapCityName)}</p>`
      );
      infowindow.open(this.map);
      activeInfoWindow = infowindow;

    });
  }


  showInfoSearch(obj, draw) {
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = this.infowindowContentElementRef.nativeElement;
    infowindow.setContent(infowindowContent);
    let activeInfoWindow 

    // onload when search the location for Circle
    // if (obj.mapDrawObjectEnumId == MapDrawObjectCircle) {
      
    //   let infowindow = new google.maps.InfoWindow({
    //     position: obj.mapDrawObject.center,
    //   });
    //   infowindow.setContent(
    //     // JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    //     `
    //     City Name : ${JSON.stringify(obj.mapCityName)}</p>`
    //   );
    //   infowindow.open(this.map);
    // }

    draw.addListener('click', (mapsMouseEvent) => {

      console.log(obj, 'obj');
      if (activeInfoWindow) {
        console.log(activeInfoWindow, 'marker');
        activeInfoWindow.close();
      }
      this.latlngData = mapsMouseEvent.latLng.toJSON();
      let infowindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });

      infowindow.close();
      // const infowindowContent = this.infowindowContentElementRef.nativeElement;

      // infowindow.setContent(infowindowContent);
      infowindow.setContent(
        // JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        `<p>
        City Name : ${JSON.stringify(obj.mapCityName)}</p>`
      );
      infowindow.open(this.map);
      activeInfoWindow = infowindow;

    });
  }

  circle() {
    let map = this.map;
    var drawingTool = new google.maps.drawing.DrawingManager();
    //Allowing to draw shapes in the Client Side
    if (drawingTool.getMap()) {
      drawingTool.setMap(null); // Used to disable the Circle tool
    }
    drawingTool.setOptions({
      drawingMode: google.maps.drawing.OverlayType.CIRCLE,
      drawingControl: true,
      drawingControlOptions: {
        // position : google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.CIRCLE],
      },
    });
    //Loading the drawn shape in the Map.
    drawingTool.setMap(map);

    google.maps.event.addListener(
      drawingTool,
      'overlaycomplete',
      function (event) {
        if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
          console.log('CIRCLE TRIGGERED');
          this.getAddress();
        }
      }
    );
  }

  rectangle() {
    let map = this.map;
    var drawingTool = new google.maps.drawing.DrawingManager();
    //Allowing to draw shapes in the Client Side
    if (drawingTool.getMap()) {
      drawingTool.setMap(null); // Used to disable the Rectangle tool
    }
    drawingTool.setOptions({
      drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.RECTANGLE],
      },
    });
    //Loading the drawn shape in the Map.
    drawingTool.setMap(map);
    google.maps.event.addListener(
      drawingTool,
      'overlaycomplete',
      function (event) {
        if (event.type == google.maps.drawing.OverlayType.RECTANGLE) {
          // drawRectangle(event.overlay.getBounds().getNorthEast().lat(),event.overlay.getBounds().getNorthEast().lng(),event.overlay.getBounds().getSouthWest().lat(),event.overlay.getBounds().getSouthWest().lng());
        }
      }
    );
  }

  setAddress(event) {
    console.log(event);
    this.cityMasterForm.controls.city.setValue(event.city);
    this.cityMasterForm.controls.state.setValue(event.state);
    // this.cityMasterForm.controls.address.setValue(event.address);
  }

  receivename(event) {
    console.log(event);
  }
  latlngReceive(event) {
    console.log(event);
  }
  deleteArea(){
    this.dManager.setMap(null)
    // this.cityMasterForm.controls.address.setValue("")
    this.cityMasterForm.controls.city.setValue("")
    this.cityMasterForm.controls.state.setValue("")

    if (this.draw) {
      this.draw.setMap(null);
    }
    // this.cityMasterForm.controls.address.setValue("")
    // this.cityMasterForm.controls.city.setValue("")
    // this.cityMasterForm.controls.state.setValue("")
    // this.dManager.setMap(this.map);
    this.dManager.setMap(this.map)


  }

 
}
