import { HttpClient } from '@angular/common/http';
import { newArray } from '@angular/compiler/src/util';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { eventNames } from 'cluster';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MapDrawObjectCircle, MapDrawObjectPolygon, MapDrawObjectRectangle } from 'src/app/core/constants/common-constant';
import { Uiconfig } from 'src/app/core/models/ui/uiconfig.model';
import { GeoFencingService } from 'src/app/core/services/geo-fencing.service';
import { AreaService } from 'src/app/core/services/master/area/area.service';
import { CityMasterService } from 'src/app/core/services/master/city/city-master.service';
import { ZoneService } from 'src/app/core/services/zone.service';
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
  selector: 'app-geo-fencing',
  templateUrl: './geo-fencing.component.html',
  styleUrls: ['./geo-fencing.component.scss'],
})
export class GeoFencingComponent implements OnInit, OnDestroy {
  window: any;
  map: any;
  cordinateData: any = {};
  getCordinateData: any = {};
  locationData!:any


  // @ViewChild('map') mapRef: ElementRef;

  constructor(private fb: FormBuilder, private geo:GeoFencingService,
    private toastr: ToastrService,private zoneService: ZoneService,
    private cityService:CityMasterService,
    private AreaService:AreaService
    ) {

  }

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
  // @Output() nameEmitter = new EventEmitter<string>();
  // @Output() latlngEmitter = new EventEmitter<string>();
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  @ViewChild('mode', { read: ElementRef, static: false }) modeRef: ElementRef;
  @ViewChild('panel') panelRef: ElementRef;
  @ViewChild('moveBtn', { read: ElementRef, static: false }) moveBtnRef: ElementRef;
  @ViewChild('moveBtn1', { read: ElementRef, static: false }) moveBtn1Ref: ElementRef;

  @ViewChild('delete', { read: ElementRef, static: false }) deleteRef: ElementRef;

  areaDropdown = new Uiconfig();
  cityDropdown = new Uiconfig();
  cityData:any = []
  areaData:any=[]
  cityForm:FormGroup 
  subscription:Subscription[]=[]
  


  poly: any;
  geoCoder: any;

  myselectedPath: any = [];
  circleData: any = [];
  polylineData: any = [];
  rectData: any = [];
  polygonData2: any = [
    '"acxiCoe`nM}D~nD`|GxrBpiCs`HopFmdE"',
    '"acxiCoe`nM}D~nD`|GxrBpiCs`HopFmdE"',
  ];
  markerData: any = [];
  addressForm: FormGroup;
  polygonEvent:any

  apiData:any
  marker:any=[]

  ngOnInit(): void {
    // city Dropdown
    this.cityDropdown.label = 'Select City';
    this.cityDropdown.key = 'mapCityId'
    this.cityDropdown.displayKey = 'mapCityName'

    //area
    this.areaDropdown.label ='Select Area';
    this.areaDropdown.key = 'areaId'
    this.areaDropdown.displayKey = 'name'

    this.cityForm= this.fb.group({
      cityId:[''],
      areaid:[''],
      lock:['EMI0998']
    })
    
    this.addressForm = this.fb.group({
      city: [],
      district: [],
      division: [],
      state: [],
      country: [],
      pincode: [],
      placeId: [],
      address: [],
    });
    this.geoCoder = new google.maps.Geocoder();
    this.getCity()
    this.getAllAreaList()
  }

  getCity() {
    this.cityData =[]
    this.areaData=[]
    // this.isChangeMap=true
    // const stateId = this.createZoneForm.value.stateId;
   
    this.subscription.push(this.zoneService.getMapCity(0).subscribe((res) => {
      if (res.statusCode === 200) {
        this.cityData = res.data;

       
      } else {
        this.toastr.warning(res.message);
      }
    }))

  }
  getAllAreaList(){

    this.areaData=[]
    // this.spinner.show();
    this.subscription.push(this.zoneService.getAreaDetailOnMapZone(0,0,0).subscribe(res=>{
      if (res.statusCode === 200) {
        this.areaData = res.data
        console.log(this.areaData,"areaData")
        // this.spinner.hide()
        // this.toastr.success(res.message);
      }
      else{
        this.toastr.warning(res.message);
        // this.spinner.hide()

      }
    }))
    
  }
mapData=[]
  getCityMaps(e){
    // this.areaData=[]
    // this.cityForm.controls.areaId.setValue('')
    this.mapData=[]
    this.initMap()
    this.subscription.push(this.cityService.getCityMapDetailById(e).subscribe(res=>{
      if (res.statusCode === 200) {
        this.mapData = res.data
  
        this.drawAreaOrCity(this.mapData[0])
        
        console.log(this.mapData,"cityDetalareaData")
        // this.toastr.success(res.message);
      }
      else{
        // this.toastr.warning(res.message);
        // this.spinner.hide()
  
      }
    }))
  }
  

  getAreaMaps(e){
    // this.cityData=[]
    this.cityForm.controls.cityId.setValue('')

    this.initMap()
    this.subscription.push(this.AreaService.getAreaDetailBySearch(e,0,'','','','Other').subscribe((res) => {
      if(res.statusCode === 200){
        this.mapData = res.data;
        
        console.log(this.mapData,"check this.allZoneData")
        this.drawAreaOrCity(this.mapData[0])
      }else{
        // this.toastr.warning(res.message)
      }
    }))

  
  }

  drawAreaOrCity(data){
    console.log(this.map)
    if (data) {
      let draw
     let obj =data
console.log(obj,
  "chekk")
  //obj.mapDrawObject = obj.areaMapDrawObject || obj.mapDrawObject
  console.log(obj.mapDrawObject)
     if(obj.mapDrawObject || obj.areaMapDrawObject){
      //obj.mapDrawObjectEnumId = obj.areaMapDrawObjectEnumId || obj.mapDrawObjectEnumId
     
        this.map.setZoom(10);
        this.map.setCenter(obj.mapDrawObject.center)
        
        // console.log(obj);
        if (obj.mapDrawObjectEnumId == MapDrawObjectCircle) {
          // circle
         // obj.mapDrawObject.radius= obj.areaMapDrawObject.radius || obj.mapDrawObject.radius
        //  obj.mapDrawObject.center= obj.areaMapDrawObject.center || obj.mapDrawObject.center
        
           draw = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map:this.map,
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
            map:this.map,
            bounds: obj.mapDrawObject.bounds,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: -1,
          });
          // this.showInfo(obj, draw); // show info tag
  
          
        }
        if (obj.mapDrawObjectEnumId == MapDrawObjectPolygon) {
         // obj.mapDrawObject.path =  obj.areaMapDrawObject.path || obj.mapDrawObject.path 
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
            map:this.map,
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

  setDevice(){

    let marker = JSON.parse(localStorage.getItem('markerApi'))
    console.log(marker)
    let lat= marker.lat//22.70872188999673
    let lng = marker.lng//75.85214680524903
    let device = this.cityForm.value.lock

    if(lat ==null || lng== null || device== null ){
      this.toastr.warning("set all, parameter device, lat and lng on map")
    }
    console.log(lat,lng,device,"check api ")
    this.subscription.push(this.AreaService.setLatLngOrDevice(lat,lng,device).subscribe((res) => {
      
      this.toastr.success("Lat, lng and device Set ")
      console.log(res)
      // if(res.statusCode === 200){
      //   this.mapData = res.data;
        
      //   console.log(this.mapData,"check this.allZoneData")
      //   this.drawAreaOrCity(this.mapData[0])
      // }else{
      //   // this.toastr.warning(res.message)
      // }
    }))
  }

  ngAfterViewInit() {
    // console.log(this.mapRef);
    // this.getAdminCurrentLocation()
    this.initMap();
  }

  initMap(): void {
    var coordinates: any = [];
    let new_coordinates:Array<any> = [];
    let lastElement;
    let array: any = [];
    let arrayCircle: any = [];
    let arrayPolyline: any = [];
    let arrayRect: any = [];
    let arrayMarker: any = [];

    var all_overlays = [];
    var selectedShape;

    var polygonEvent
    var circleEvent
    var rectEvent

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        // console.log(position, 'position');
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
        // console.log(this.lat, this.lng);
        const myLatLng = { lat: this.lat, lng: this.lng };
      });
    }
    // console.log(this.lat, this.lng);
    this.showMap(22.7195687, 75.8577258);

    this.map = new google.maps.Map(this.mapRef.nativeElement, {
      center: { lat: 22.7195687, lng: 75.8577258 }, //{ lat: 44.5452, lng: -78.5389 },
      zoom: 15,
    });

    

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
      markerOptions: {
        // icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        clickable: true,
        icon:"'../../../../../assets/images/evegah_green.ico",
        // editable: true,
        draggable: true,
        zIndex: 1,
      },
       circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        draggable: true,
        capturing:true,

        zIndex: 1,
      },
      polygonOptions: {
        path: this.myselectedPath,
        fillColor: '#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        // draggable: true,
        zIndex: 1,
      },
      rectangleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
    });

    // console.log(drawingManager, 'drawing manager');

    drawingManager.setMap(this.map);

    google.maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      function (event) {
        // console.log(event.getPath());
        this.polygonEvent = event
        polygonEvent=event
        // console.log(this.polygonEvent,"polygonEvent", polygonEvent)
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
            // console.log(event)
          }
        );

        google.maps.event.addListener(event.getPath(), 'set_at', function () {
          getPolygonCoords(event);
        });

        let path = {
          path: google.maps.geometry.encoding.encodePath(event.getPath()),
          coordinates: coordinates,
        };
        this.apiData= {
          'polygonpoint':new_coordinates,//coordinates,
          'type':'polygon'
        }
        localStorage.setItem('apiData', JSON.stringify(this.apiData))

      // movememnt tracking the path 
        // google.maps.event.addListener(this.map, "click", (e) => {
        //   console.log(e,"contain", event, event.getPath())
        //   const resultColor = google.maps.geometry.poly.containsLocation(
        //     e.latLng,
        //     event,
        //   )
        //     ? "blue"
        //     : "red";
        //   const resultPath = google.maps.geometry.poly.containsLocation(
        //     e.latLng,
        //     event,
        //   )
        //     ? // A triangle.
        //       "m 0 -1 l 1 2 -2 0 z"
        //     : google.maps.SymbolPath.CIRCLE;
      
        //     console.log(google.maps.geometry.poly.containsLocation(
        //       e.latLng,
        //       event,
        //     ), e.latLng,"check", JSON.stringify(e.latLng.lat)
        //     )
        //     // if(resultColor =='red'){
        //     //    alert("Out From Area")
        //     // }
        //   new google.maps.Marker({
        //     position: e.latLng,
        //     map:this.map,
        //     icon: {
        //       path: resultPath,
        //       fillColor: resultColor,
        //       fillOpacity: 0.2,
        //       strokeColor: "white",
        //       strokeWeight: 0.5,
        //       scale: 10,
        //     },
        //   });
        // });
      



        console.log( 'polgon path', path,);

        // this.polygonData2.push("r")
        array.unshift(path);
        // console.log(this.polygonData2, array);

        localStorage.setItem('polygonData', JSON.stringify(array));
      }
    );

    google.maps.event.addListener(
      drawingManager,
      'circlecomplete',
      function (circle) {
        circleEvent = circle
        const center = circle.getCenter();
        const radius = circle.getRadius();
        const obj: any = {
          center: center,
          radius: radius
        }

        console.log("center: ",center.lat(),center.lng(), "radius", radius)

        this.apiData= {
          'center':[center.lat(),center.lng()],
          'radius':radius,
          'type':'circle'
        }
        localStorage.setItem('apiData', JSON.stringify(this.apiData))
      //   new google.maps.Circle({
      //     center: {latitude, longitude},
      //     radius,
      // })
      //     .getBounds()
      //     .contains({ lat: location.lat(), lng: location.lng() });


        arrayCircle.unshift(obj);

        if(arrayCircle.length> 1){
          // console.log(arrayCircle,"arrayCircle")
          // hasIntersections(arrayCircle[0].event, arrayCircle[1].event)
        }
        // console.log( 'circleData', obj);
        // localStorage.setItem('circleData', JSON.stringify(arrayCircle));
      }
    );

    function hasIntersections(circle0, circle1) {
      var center0 = circle0.getCenter();
      var center1 = circle1.getCenter();
    
      var maxDist = circle0.getRadius() + circle1.getRadius();
      var actualDist = google.maps.geometry.spherical.computeDistanceBetween(center0, center1);
    
      return maxDist >= actualDist;
    }

    google.maps.event.addListener(
      drawingManager,
      'rectanglecomplete',
      function (event) {
        // console.log(event, 'rect');
        rectEvent =event
        // console.log(event.getBounds().getCenter().lat(), 'lat');
        // console.log(event.getBounds().getCenter().lng(), 'lng');
        // console.log(rectangle.getBounds().getCenter().toJSON());
        const ne = event.getBounds().getNorthEast();
        const sw = event.getBounds().getSouthWest();
        let bounds = {
          bounds: event.getBounds(),
          centerLat: event.getBounds().getCenter().lat(),
          centerLng: event.getBounds().getCenter().lng(),
        };

        console.log( "ne :",ne.lat(),ne.lng(),"sw :", sw.lat(),sw.lng());
         this.apiData= {
          'ne':[ne.lat(),ne.lng()],
          'sw':[sw.lat(),sw.lng()],
          'type':'rect'
        }
        localStorage.setItem('apiData', JSON.stringify(this.apiData))
        arrayRect.unshift(bounds);
        localStorage.setItem('rectData', JSON.stringify(arrayRect));
      }
    );

    google.maps.event.addListener(
      drawingManager,
      'polylinecomplete',
      function (event) {
        // console.log(event, 'rect');
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
            // console.log(event)
          }
        );

        // google.maps.event.addListener(event.getPath(), 'set_at', function () {
        //   getPolygonCoords(event);
        // });
        const path = google.maps.geometry.encoding.encodePath(event.getPath());
        console.log("poligone", path)
        arrayPolyline.push(path);
        localStorage.setItem('polylineData', JSON.stringify(arrayPolyline));
      }
    );

    google.maps.event.addListener(
      drawingManager,
      'markercomplete',
      function (event) {
        console.log( 'marker position', event.getPosition().lat(), event.getPosition().lng());
       let lat=event.getPosition().lat()
       let lng=event.getPosition().lng()
        this.marker= {
          lat :lat,
          lng : lng
        }

        localStorage.setItem('markerApi', JSON.stringify(this.marker));
        //  this.setDevice()
       console.log(this.marker)
        const path = event.getPosition();
        arrayMarker.unshift(path);
        localStorage.setItem('markerData', JSON.stringify(arrayMarker));
      }
    );

    var getPolygonCoords = function (newShape) {
      coordinates.splice(0, coordinates.length);
      new_coordinates.splice(0, new_coordinates.length);
      var len = newShape.getPath().getLength();

      for (var i = 0; i < len; i++) {
        coordinates.push(newShape.getPath().getAt(i).toUrlValue(6));
        let cor= (newShape.getPath().getAt(i).toUrlValue(8))
     let check:Array<number>=   cor.split(",")
     let newArra:Array<number>=[]
     check.forEach(e=>{
      newArra.push(Number(e))
     })
        console.log(cor, check,"new", newArra)

        new_coordinates.push(newArra);

      }
      // document.getElementById('map').innerHTML = coordinates
      console.log(coordinates, new_coordinates,'coordinates');
    };

    this.map.addListener('click', (mapsMouseEvent) => {
      console.log(mapsMouseEvent);
      this.latlngData = mapsMouseEvent.latLng.toJSON();
      this.myselectedPath.push(this.latlngData);
      console.log(this.latlngData, ':data', this.myselectedPath);
    });

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
        //getBounds().getNorthEast() and getSouthWest()
        console.log({ bounds: rectangle.getBounds()?.toJSON(), eventName });
        this.cordinateData = rectangle.getBounds()?.toJSON();
      });
    });

    // polygon and polyline
    // this.poly = new google.maps.Polygon({
    //   path: this.myselectedPath,
    //   strokeColor: '#000000',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 3,
    //   fillColor: '#ffff00',
    //   fillOpacity: 0.2,
    // });
    // this.poly.setMap(this.map);
    // // Add a listener for the click event
    // this.map.addListener('click', (e) => {
    //   this.addLatLng(e);
    //    //this.showLatLng()
    // });

    // circle
    // const cityCircle = new google.maps.Circle({
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: '#FF0000',
    //   fillOpacity: 0.35,
    //   editable: true,
    //   draggable: true,
    //   map,
    //   center: { lat: 22.7195687, lng: 75.8577258 },
    //   radius: Math.sqrt(20) * 100,
    // });
    // cityCircle.setMap(this.map);
    function clearSelection() {
      if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
      }
    }
    //to disable drawing tools
    function stopDrawing() {
      drawingManager.setMap(null);
    }

    function setSelection(shape) {
      clearSelection();
      // stopDrawing()
      selectedShape = shape;
      shape.setEditable(true);
    }

    function deleteSelectedShape() {
      console.log(selectedShape,"sahpe")
      if (selectedShape) {
        selectedShape.setMap(null);
        drawingManager.setMap(map);
        coordinates.splice(0, coordinates.length);
        // document.getElementById('map').innerHTML = ""
      }
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

      //to delete the polygon
      controlUI.addEventListener('click', function () {
        deleteSelectedShape();
      });
    }

    this.deleteRef.nativeElement.addEventListener('click', function () {
      deleteSelectedShape();
    });
  

    google.maps.event.addListener(
      drawingManager,
      'overlaycomplete',
      function (event) {
        all_overlays.push(event);
        // console.log(event);

        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          drawingManager.setDrawingMode(null);
        
          var newShape = event.overlay;
          newShape.type = event.type;
          google.maps.event.addListener(newShape, 'click', function () {
            // console.log(newShape)
            // console.log(newShape )

            setSelection(newShape);
          });
          // console.log(newShape)
          setSelection(newShape);
        
      }
      
      if (event.type == google.maps.drawing.OverlayType.RECTANGLE){
          // console.log(event.type)
      }
      
    }
    );

    var centerControlDiv: any = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, this.map);

    // console.log(centerControlDiv);
    centerControlDiv.index = 1;
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      // clearButton
      // centerControlDiv
    );
         
    
    // ----------------------------  On map clicl get lat and lng---- start
    // const infowindow = new google.maps.InfoWindow();
    // const infowindowContent = this.infowindowContentElementRef.nativeElement;
    // infowindow.setContent(infowindowContent);
   
        google.maps.event.addListener(drawingManager,'click', (mapsMouseEvent) => {
      this.latlngData = mapsMouseEvent.latLng.toJSON();
      console.log(this.latlngData,"this.latlngData draw", )

      let infowindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });

      console.log(this.latlngData);
      infowindow.close();
      infowindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infowindow.open(drawingManager);
    });
    this.map.addListener('click', (mapsMouseEvent) => {
      this.latlngData = mapsMouseEvent.latLng.toJSON();
      console.log(this.latlngData,"this.latlngData")
      let infowindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });

      console.log(this.latlngData);
      infowindow.close();
      infowindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
      );
      infowindow.open(this.map);
    });
 // ----------------------------  On map clicl get lat and lng-------end
    // For distance and origin and destination
   const directionsService = new google.maps.DirectionsService();
   const directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map,
    panel:this.panelRef.nativeElement //document.getElementById("panel") as HTMLElement,
  });
  directionsRenderer.addListener("directions_changed", (e) => {
    const directions = directionsRenderer.getDirections();
    if (directions) {
      this.computeTotalDistance(directions);
    }
  });
  

  directionsRenderer.setMap(this.map);
 let i:number= 0.1
  // setInterval(()=>{
  // i= Number(i)+Number(0.01)
  //   console.log(i)
    
  //   this.calculateAndDisplayRoute(directionsService, directionsRenderer,i);
  // },
  // 3000
  // )
  let dest={ 
    lat: 22.751118634027854 ,
     lng: 75.89529121276294}
     let way =[ {
     location: "Banganga, Indore, Madhya Pradesh"
    }]
  //  this.calculateAndDisplayRoute(directionsService, directionsRenderer,dest,way);
   this.modeRef.nativeElement.addEventListener("change", () => {
    this.calculateAndDisplayRoute(directionsService, directionsRenderer,dest,way,polygonEvent,circleEvent,rectEvent);
  });

  this.moveBtnRef.nativeElement.addEventListener("click", (e) => {
  let  dest={
     lat: 22.731064755667624,
      lng: 75.90912521915168
    }
    let way = [
    //   {
    //     location: "Banganga, Indore, Madhya Pradesh"
    //    },{
    //   location: "Vijay Nagar, Indore"
    //  }
  ]
      // google.maps.event.addListener(this.map, "zoom_changed", (e) => {
     
      // const resultColor = google.maps.geometry.poly.containsLocation(
      //   e,
      //   polygonEvent,
      // )
      // console.log(e,resultColor  )
      // })
    this.calculateAndDisplayRoute(directionsService, directionsRenderer,dest,way,polygonEvent,circleEvent,rectEvent);
  });
  

  this.moveBtn1Ref.nativeElement.addEventListener("click", (e) => {
    let  dest={
       lat:   22.724850252625878,
        lng: 75.90614797194692
      }
      let way = [
        // { location: "Banganga, Indore, Madhya Pradesh" },
        // {location: "Vijay Nagar, Indore"},
        {location: "Khajrana Ganesh Mandir, indore"}
      ]       
      this.calculateAndDisplayRoute(directionsService, directionsRenderer,dest,way,polygonEvent,circleEvent,rectEvent);
    });
    
  }


  intervals!:any
  distance:any=0
  duration:any=0




/// new for destination change
calculateAndDisplayRoute(directionsService, directionsRenderer,dest, way, polygonEvent,circleEvent,rectEvent) {
   
  
  console.log(this.modeRef.nativeElement.value,"this.modeRef.nativeElement")
 const selectedMode = this.modeRef.nativeElement.value//"DRIVING"// = document.getElementById("mode").value;

 let request = {
    origin: { lat:  22.718426707728618, lng: 75.85553675648774 },
    destination: { 
      lat: Number(dest.lat), //,|22.751118634027854 ,
      lng: Number(dest.lng)}, //| 75.89529121276294},
    waypoints: [
      // { location: "Banganga, Indore, Madhya Pradesh" },
      //  {lat:22.741492610124233, lng:75.85065113247933}
    ],
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode[selectedMode]//'DRIVING'
  };
  request.waypoints = [...way]


directionsService.route(
    request
  
  )
  .then((response) => {
  console.log(response,"respnse")
  
    directionsRenderer.setDirections(response);
    directionsRenderer.setOptions( { 
      suppressMarkers: true,// show custome marker
      markerOptions: {
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,},
      polylineOptions: {
      strokeWeight: 4,
      strokeOpacity: 1,
      strokeColor:  'red' 
  } } );
    this.locationData=response.routes[0].legs[0]
  console.log(this.locationData,"location")
  this.distance = this.locationData.distance.text
  
  this.duration = this.locationData.duration.text
  // end_point

let lastPoint= response.routes[0].legs
console.log(lastPoint,"lastPonits")
console.log(polygonEvent,response.routes[0].legs[lastPoint.length-1].end_location)
if(polygonEvent){
  const result = google.maps.geometry.poly.containsLocation(
    response.routes[0].legs[lastPoint.length-1].end_location,// response.routes[0].legs[0].steps[lastPoint.length-1].end_location,// response.routes[0].legs[0].end_location,
    polygonEvent,
  )
  if(!result){
    alert("go to outside from Area")
  }
  else{
  console.log("inside from the area")
  }
  console.log(result, "result")

}

// for circle 
if(circleEvent){
  console.log( response.routes[0].legs[lastPoint.length-1].end_location.lat(),"lat")
  let bound= circleEvent.getBounds()
console.log(circleEvent.getBounds(),"check", bound, circleEvent)
  // const result = circleEvent.getBounds()
  // .contains({ lat:  response.routes[0].legs[lastPoint.length-1].end_location.lat(), lng:  response.routes[0].legs[lastPoint.length-1].end_location.lng() });
  
  const result=  google.maps.geometry.spherical.computeDistanceBetween(response.routes[0].legs[lastPoint.length-1].end_location, circleEvent.getCenter()) <= circleEvent.getRadius()
 console.log(result)
  if(!result){
    alert("go to outside from Area")
  }
  else{
  console.log("inside from the area")
  }
  console.log(result, "result")

}

// for rect 
if(rectEvent){
  console.log( response.routes[0].legs[lastPoint.length-1].end_location.lat(),"lat",rectEvent.getBounds())
  const result = rectEvent.getBounds()
  .contains({ lat:  response.routes[0].legs[lastPoint.length-1].end_location.lat(), lng:  response.routes[0].legs[lastPoint.length-1].end_location.lng() });
  if(!result){
    alert("go to outside from Area")
  }
  else{
  console.log("inside from the area")
  }
  console.log(result, "result")

}
  


  })
  .catch((e) => window.alert("Directions request failed due to " + status));

}

  rideStart() {
    // this.intervals=   setInterval(()=>{
    //   this.getDashboardCard();

    // },
    // 5000
    // )
  }

  computeTotalDistance(result: google.maps.DirectionsResult) {
    let total = 0;
    const myroute = result.routes[0];
  
    if (!myroute) {
      return;
    }
  
    for (let i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i]!.distance!.value;
    }
  
    total = total / 1000;
    (document.getElementById("total") as HTMLElement).innerHTML = total + " km";
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
    let circleData: any = JSON.parse(localStorage.getItem('circleData'));
    const rectData = JSON.parse(localStorage.getItem('rectData'));
    const polygonData = JSON.parse(localStorage.getItem('polygonData'));
    const markerData = JSON.parse(localStorage.getItem('markerData'));

    if (circleData) {
      console.log(circleData, 'circleData');
      const latlng = {
        lat: circleData[0].center.lat,
        lng: circleData[0].center.lng, //parseFloat(latlngStr[1]),
      };

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
            console.log(this.address, 'Address Object');

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
            //   console.log(c,"row")
            //   if (c.types.includes('plus_code')) return c.long_name;
            // });
            let pincode 
            if(postal_code.length > 0){
               pincode = postal_code[0].long_name ;

            }
            else{
               pincode = "No Pincode Available" ;
            }
            const addressObject = {
              city: locality[0].long_name,
              district: administrative_area_level_3[0].long_name,
              division: administrative_area_level_2[0].long_name,
              state: administrative_area_level_1[0].long_name,
              country: country[0].long_name,
              pincode: pincode,
              placeId: this.address.place_id,
              address: this.address.formatted_address,
            };
            this.addressDetail = addressObject;
            console.log(addressObject);
            this.showAddress = true;

            this.addressForm.setValue(this.addressDetail);
            // infowindow.setContent(response.results[0].formatted_address);
            // infowindow.open(map, marker);
          } else {
            window.alert('No results found');
          }
        })
        .catch((e) => window.alert('Geocoder failed due to: ' + e));
    } else if (rectData) {
      console.log(rectData);
      const latlng = {
        lat: rectData[0].centerLat,
        lng: rectData[0].centerLng, //parseFloat(latlngStr[1]),
      };

      geocoder
        .geocode({ location: latlng })
        .then((response) => {
          if (response.results[0]) {
            this.address = response.results[0];
            console.log(this.address, 'Address Object');

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

            let pincode 
            if(postal_code.length > 0){
               pincode = postal_code[0].long_name ;
            }
            else{
               pincode = "No Pincode Available" ;
            }
            const addressObject = {
              city: locality[0].long_name,
              district: administrative_area_level_3[0].long_name,
              division: administrative_area_level_2[0].long_name,
              state: administrative_area_level_1[0].long_name,
              country: country[0].long_name,
              pincode: pincode,
              placeId: this.address.place_id,
              address: this.address.formatted_address,
            };
            this.addressDetail = addressObject;
            console.log(addressObject);
            this.showAddress = true;

            this.addressForm.setValue(this.addressDetail);
            // infowindow.setContent(response.results[0].formatted_address);
            // infowindow.open(map, marker);
          } else {
            window.alert('No results found');
          }
        })
        .catch((e) => window.alert('Geocoder failed due to: ' + e));
    } else if (polygonData) {
      console.log(polygonData);
      let coordinate = polygonData[0].coordinates[0].split(',');
      console.log(coordinate[0], coordinate[1]);
      const latlng = {
        lat: parseFloat(coordinate[0]),
        lng: parseFloat(coordinate[1]), //parseFloat(latlngStr[1]),
      };

      geocoder
        .geocode({ location: latlng })
        .then((response) => {
       
          if (response.results[0]) {
            this.address = response.results[0];
            console.log(this.address, 'Address Object');

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
              console.log(c.types,"type")
              if (c.types.includes('postal_code')){
                
                return c.long_name;
              } 
           
            });
          
            let pincode 
            if(postal_code.length > 0){
               pincode = postal_code[0].long_name ;
            }
            else{
               pincode = "No Pincode Available" ;
            }

            console.log(pincode)
            const addressObject = {
              city: locality[0].long_name,
              district: administrative_area_level_3[0].long_name,
              division: administrative_area_level_2[0].long_name,
              state: administrative_area_level_1[0].long_name,
              country: country[0].long_name,
              pincode: pincode || 'Pincode not available',
              placeId: this.address.place_id,
              address: this.address.formatted_address,
            };
            this.addressDetail = addressObject;
            console.log(addressObject);
            this.showAddress = true;

            this.addressForm.setValue(this.addressDetail);
            // infowindow.setContent(response.results[0].formatted_address);
            // infowindow.open(map, marker);
          } else {
            window.alert('No results found');
          }
        })
        .catch((e) => window.alert('Geocoder failed due to: ' + e));
    } else if (markerData) {
      console.log(markerData);
      const latlng = {
        lat: markerData[0].lat,
        lng: markerData[0].lng, //parseFloat(latlngStr[1]),
      };

      geocoder
        .geocode({ location: latlng })
        .then((response) => {
          if (response.results[0]) {
            this.address = response.results[0];
            console.log(this.address, 'Address Object');

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

            let pincode 
            if(postal_code.length > 0){
               pincode = postal_code[0].long_name ;
            }
            else{
               pincode = "No Pincode Available" ;
            }
            const addressObject = {
              city: locality[0].long_name,
              district: administrative_area_level_3[0].long_name,
              division: administrative_area_level_2[0].long_name,
              state: administrative_area_level_1[0].long_name,
              country: country[0].long_name,
              pincode: pincode,
              placeId: this.address.place_id,
              address: this.address.formatted_address,
            };
            this.addressDetail = addressObject;
            console.log(addressObject);
            this.showAddress = true;

            this.addressForm.setValue(this.addressDetail);
            // infowindow.setContent(response.results[0].formatted_address);
            // infowindow.open(map, marker);
          } else {
            window.alert('No results found');
          }
        })
        .catch((e) => window.alert('Geocoder failed due to: ' + e));
    }
  }

   hasIntersections(circle0, circle1) {
    var center0 = circle0.getCenter();
    var center1 = circle1.getCenter();
  
    var maxDist = circle0.getRadius() + circle1.getRadius();
    var actualDist = google.maps.geometry.spherical.computeDistanceBetween(center0, center1);
  
    return maxDist >= actualDist;
  }

  show() {
    this.showMaps(this.map);
  }

  showMaps(map) {
    const circleData = localStorage.getItem('circleData');
    const rectData = localStorage.getItem('rectData');
    const polygonData = localStorage.getItem('polygonData');
    const polylineData = localStorage.getItem('polylineData');
    const markerData = localStorage.getItem('markerData');

    if (circleData) {
      const obj = JSON.parse(circleData);
      for (let i = 0; i < obj.length; i++) {
        new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map,
          radius: obj[i].radius,
          center: obj[i].center,
        });
      }
    }

    if (rectData) {
      const obj = JSON.parse(rectData);
      for (let i = 0; i < obj.length; i++) {
        new google.maps.Rectangle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map,
          // restriction: {
          //   latLngBounds: obj[i],
          //   strictBounds: false,
          // },
          bounds: obj[i].bounds,
          // strictBounds: false,
        });
      }
    }

    if (polygonData) {
      const obj = JSON.parse(polygonData);
      for (let i = 0; i < obj.length; i++) {
        let path = google.maps.geometry.encoding.decodePath(obj[i].path);

        console.log(path, obj[i]);
        let newMap = new google.maps.Polygon({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map,
          path: path,
        });
        newMap.setMap(this.map);

        google.maps.event.addListener(map, "click", (e) => {
          console.log(e)
          const resultColor = google.maps.geometry.poly.containsLocation(
            e.latLng,
            path,
          )
            ? "blue"
            : "red";
          const resultPath = google.maps.geometry.poly.containsLocation(
            e.latLng,
           path,
          )
            ? // A triangle.
              "m 0 -1 l 1 2 -2 0 z"
            : google.maps.SymbolPath.CIRCLE;
      
          new google.maps.Marker({
            position: e.latLng,
            map:this.map,
            icon: {
              path: resultPath,
              fillColor: resultColor,
              fillOpacity: 0.2,
              strokeColor: "white",
              strokeWeight: 0.5,
              scale: 10,
            },
          });
        });
      
      }
    }

    if (polylineData) {
      const obj = JSON.parse(polylineData);
      for (let i = 0; i < obj.length; i++) {
        const path = google.maps.geometry.encoding.decodePath(obj[i]);
        new google.maps.Polyline({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map,
          path: path,
        });
      }
    }

    if (markerData) {
      const obj = JSON.parse(markerData);
      for (let i = 0; i < obj.length; i++) {
        console.log(obj);
        new google.maps.Marker({
          map,
          position: obj[i],
          lat: obj[i].lat,
          lng: obj[i].lng,
          icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        });
      }
    }
  }

  addLatLng(event: any) {
    console.log(event);
    const path = this.poly.getPath();

    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(event.latLng);
    console.log(path, 'path');
    // Add a new marker at the new plotted point on the polyline.
    new google.maps.Marker({
      position: event.latLng,
      title: '#' + path.getLength(),
      map: this.map,
    });
  }

  setCordinate() {
    console.log(this.cordinateData);
    sessionStorage.setItem(
      'cordinateData',
      JSON.stringify(this.myselectedPath)
    );
  }

  getCordinate() {
    console.log(this.cordinateData);
    // sessionStorage.setItem('cordinateData', JSON.stringify(this.cordinateData))
    this.getCordinateData = JSON.parse(sessionStorage.getItem('cordinateData'));

    // const map = new google.maps.Map(
    //   this.mapRef.nativeElement ,
    //   {
    //     center: { lat: 44.5452, lng: -78.5389 },
    //     zoom: 9,
    //   }
    // );
    const rectangle = new google.maps.Rectangle({
      bounds: this.getCordinateData,
      editable: true,
      draggable: true,
    });

    rectangle.setMap(this.map);

    this.poly = new google.maps.Polygon({
      path: this.getCordinateData,
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      // editable: true,
      // draggable: true,
    });
    this.poly.setMap(this.map);
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
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
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
      zoom: 15,
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
      if (this.zoneAddress) {
        const zoneFormData: any = {
          address: this.zoneAddress.formatted_address,
          stateCity: this.zoneAddress.address_components,
        };
        console.log(zoneFormData);
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
    /////////////////////////////////////////lat long code //////////////////////////////////////////////////////////

    // const location = new google.maps.LatLng(-34.397,150.644)
    // const options = {
    //   center: location,
    //   zoom:8
    // }
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

            console.log(this.latlngData);
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

  ngOnDestroy() {
    localStorage.removeItem('circleData');
    localStorage.removeItem('rectData');
    localStorage.removeItem('markerData');
    localStorage.removeItem('polylineData');
    localStorage.removeItem('polygonData');
     localStorage.removeItem('markerApi')
      localStorage.removeItem('apiData')
  }

  reloadPage() {
    window.location.reload();
  }


  sendCircle(){
    this.apiData = JSON.parse(localStorage.getItem('apiData'))
    this.marker =JSON.parse(localStorage.getItem('markerApi'))
    if(this.apiData.type){
      let obj={
        "center":this.apiData.center,
        "radius":this.apiData.radius,
        "point":[this.marker.lat,this.marker.lng]
      }
      console.log(obj)
      this.geo.findPointOnCircle(obj).subscribe(res=>{
        console.log(res)

        if(res.statusCode == 200){
           this.toastr.success(res.data)
          //  localStorage.removeItem('markerApi')
          //  localStorage.removeItem('apiData')

        }
        else{
          this.toastr.warning(res.message)

        }
      })
    }
    else{
      this.toastr.warning("circle not created")
    } 
  }

  sendRect(){
    this.apiData = JSON.parse(localStorage.getItem('apiData'))
    this.marker =JSON.parse(localStorage.getItem('markerApi'))
    if(this.apiData){
      let obj={
            "sw":this.apiData.sw,
            "ne":this.apiData.ne,
            "point":[this.marker.lat,this.marker.lng]
          }
          this.geo.findPointOnRect(obj).subscribe(res=>{
            console.log(res)
            if(res.statusCode == 200){
           this.toastr.success(res.data)
          //  localStorage.removeItem('markerApi')
          //  localStorage.removeItem('apiData')
            }
            else{
              this.toastr.warning(res.message)
            }
          })
    }
    
  }

  sendPolygon(){
    this.apiData = JSON.parse(localStorage.getItem('apiData'))
    this.marker =JSON.parse(localStorage.getItem('markerApi'))
    if(this.apiData){
    let obj={
      "polygonpoint":this.apiData.polygonpoint,//[[22.728921,75.89788], [22.743487,75.90612], [22.742854,75.920196], [22.752669,75.929123], [22.737471,75.931183], [22.723538,75.92466], [22.736204,75.91951]],
      "point":[this.marker.lat,this.marker.lng]
    }
    console.log(obj)
    this.geo.findPointOnPolygon(obj).subscribe(res=>{
       console.log(res)
       if(res.statusCode == 200){
        this.toastr.success(res.data)
       //  localStorage.removeItem('markerApi')
       //  localStorage.removeItem('apiData')
         }
         else{
           this.toastr.warning(res.message)
         }
    })
  }
  }

  InputRadius:number=0
  FindPointnearestPoint(){
    let marker =JSON.parse(localStorage.getItem('markerData'))
if(marker){
  let obj={
    "point1":[marker[0].lat,marker[0].lng ],
    "point2":[marker[1].lat,marker[1].lng ],//[this.marker.lat,this.marker.lng],
    "radius":this.InputRadius//50940.259099569071// / from textbox /
  }
  console.log(obj)
  this.geo.findPointNearestPoint(obj).subscribe(res=>{
     console.log(res)
     if(res.statusCode == 200){
      this.toastr.success(res.data)
       }
       else{
         this.toastr.warning(res.message)
       }
  })
}
    
  }


  FindPointnearestPointDistance(){
    let marker =JSON.parse(localStorage.getItem('markerData'))
    if(marker){
      let obj={
        "point1":[marker[0].lat,marker[0].lng ],
        "point2":[marker[1].lat,marker[1].lng ],//[this.marker.lat,this.marker.lng],
        "radius":this.InputRadius//50940.259099569071// / from textbox /
      }
      console.log(obj)
    
    this.geo.FindPointNearestPointDistance(obj).subscribe(res=>{
       console.log(res)
       if(res.statusCode == 200){
        this.toastr.success(res.data[0].distance,"distance")
         }
         else{
           this.toastr.warning(res.message)
         }
    })
  }
  }


  FindPointnearestPointFL(){
    let marker =JSON.parse(localStorage.getItem('markerData'))
    this.marker =JSON.parse(localStorage.getItem('markerApi'))

if(marker){
  let obj={
    "point1":[marker[marker.length -1].lat,marker[marker.length -1].lng ],
    "point2":[this.marker.lat,this.marker.lng],//[marker[1].lat,marker[1].lng ],//[this.marker.lat,this.marker.lng],
    "radius":this.InputRadius//50940.259099569071// / from textbox /
  }
  console.log(obj)
  this.geo.findPointNearestPoint(obj).subscribe(res=>{
     console.log(res)
     if(res.statusCode == 200){
      this.toastr.success(res.data)
       }
       else{
         this.toastr.warning(res.message)
       }
  })
}
    
  }


  FindPointnearestPointDistanceFL(){
    let marker =JSON.parse(localStorage.getItem('markerData'))
    this.marker =JSON.parse(localStorage.getItem('markerApi'))

    if(marker){
      let obj={
        "point1":[marker[marker.length -1].lat,marker[marker.length -1].lng ],
        "point2":[this.marker.lat,this.marker.lng],//[marker[1].lat,marker[1].lng ],//[this.marker.lat,this.marker.lng],
        "radius":this.InputRadius//50940.259099569071// / from textbox /
      }
      console.log(obj)
    
    this.geo.FindPointNearestPointDistance(obj).subscribe(res=>{
       console.log(res)
       if(res.statusCode == 200){
        this.toastr.success(res.data[0].distance,"distance")
         }
         else{
           this.toastr.warning(res.message)
         }
    })
  }
  }
}
