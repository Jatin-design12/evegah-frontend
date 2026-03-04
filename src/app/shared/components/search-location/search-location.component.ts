import { state } from '@angular/animations';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  AreaMapZoom,
  AreafillColor,
  MapDrawObjectCircle,
  MapDrawObjectPolygon,
  MapDrawObjectRectangle,
  MapZoom,
  ParkingZoneIcon,
} from 'src/app/core/constants/common-constant';

declare var google: any;

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit, OnChanges {
  @Input() data: any = [];
  @Input() editViewData: any = [];
  @Input() isChange:any
  @Input () oldZoneData:any
  @Input () cityandStateChange:any

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
  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;

  viewMode:boolean=false
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.oldZoneData,"oldzonedata ", this.cityandStateChange,"this.cityandstate", changes)
    console.log(this.isChange)
    // if(this.cityandStateChange){
    //   // this.delete()
    //   this.draw.setMap(null)
    // }
    this.delete()

    this.createMap(this.data); 

  }

  createMap(data) {
    this.showAllAreaOnMap(data[0]);
  }

  draw: any;
  showAllAreaOnMap(Data) {
    let map = this.map;

    if (Data) {
      let obj = Data;
      console.log(this.draw);
      // Data.forEach((obj) => {
      this.map.setZoom(AreaMapZoom);
      if (obj.mapDrawObjectEnumId == MapDrawObjectCircle) {
        // circle
        this.map.setCenter(obj.mapDrawObject.center);

        this.draw = new google.maps.Circle({
          strokeColor: AreafillColor,//'#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: AreafillColor,//'#FF0000',
          fillOpacity: 0.35,
          map,
          radius: obj.mapDrawObject.radius,
          center: obj.mapDrawObject.center,
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1,
        });

        this.showInfo(obj, this.draw); // show info tag
      } else if (obj.mapDrawObjectEnumId == MapDrawObjectRectangle) {
        // Rectangle
        console.log(obj, 'rect');
        let center = {
          lat: Number(obj.centerLat),
          lng: Number(obj.centerLng),
        };
        this.map.setCenter(center);
        this.map.setZoom(AreaMapZoom);

        this.draw = new google.maps.Rectangle({
          strokeColor: AreafillColor,//'#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: AreafillColor,//'#FF0000',
          fillOpacity: 0.35,
          map,
          bounds: obj.mapDrawObject.bounds,
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1,
        });
        this.showInfo(obj, this.draw); // show info tag
      } else if (obj.mapDrawObjectEnumId == MapDrawObjectPolygon) {
        // Polygon
        let latLng = obj.mapDrawObject.coordinates[2].toString();
        let lanLngArr = latLng.split(',');

        this.lat = Number(lanLngArr[0]);
        this.lng = Number(lanLngArr[1]);
        let center = {
          lat: Number(this.lat),
          lng: Number(this.lng),
        };

        this.map.setCenter(center);
        console.log(obj, 'polygon');

        let path = google.maps.geometry.encoding.decodePath(
          obj.mapDrawObject.path
        );
        this.draw = new google.maps.Polygon({
          strokeColor:AreafillColor, //'#FF0000',
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
        this.showInfo(obj, this.draw); // show info tag
      }
      // });

      // this.draw.addListener('click', () => {
      //   infowindow.open(this.map, marker);
      // });
    }
  }
marker:any=[]
  showInfo(obj, draw) {
    console.log(this.oldZoneData,"this.oldZoneData")
     // on load par marker 
    if(this.oldZoneData){
      console.log("stateChange","this",this.cityandStateChange)
      this.oldZoneData.forEach(e=>{
        console.log(e,"oldZone")
        let latLng= 
             {
              lat: Number(e.latitude),
              lng: Number(e.longitude),
            }
        this.marker = new google.maps.Marker({
          position: latLng, 
          map: this.map,
          icon: '../../../assets/images/'+ ParkingZoneIcon, //evegah_green.ico
          zIndex: 1,
          clickable: true,
          editable: false,
          draggable: false,
        });
        const infowindows = new google.maps.InfoWindow();
        infowindows.setContent(
          `<p>Zone name : ${JSON.stringify(e.name)}<br>
          Area name : ${JSON.stringify(e.areaName)}<br>
        City Name : ${JSON.stringify(e.cityName)}<br>
        Address : ${JSON.stringify(e.zoneAddress)}<br>
        Capacity:${JSON.stringify(e.zoneCapacity)}<br>
        Cordinates:${JSON.stringify(e.latitude)}<br>${JSON.stringify(e.longitude)}</p>`
    
        )
        infowindows.open(this.map,this.marker);
      })
    }
    var activeInfoWindow;
    
    if (this.editViewData) {
   

    
    //   const infowindow = new google.maps.InfoWindow();
    //   infowindow.setContent(
    //     `<p>Vehicle name : ${JSON.stringify(this.editViewData.name)} <br>
    //     City Name : ${JSON.stringify(this.editViewData.cityName)}<br>
    //     Latitude : ${this.editViewData.latitude} </br>
    //     Longitude : ${this.editViewData.longitude} </br>
    //     capacity : ${this.editViewData.zoneCapacity} </br>

    //     </p>`
    //   );
    //   let latlng = {
    //     lat: Number(this.editViewData.latitude),
    //     lng: Number(this.editViewData.longitude),
    //   };

    //   if (this.editViewData.title == 'edit') {
    //     const marker = new google.maps.Marker({
    //       position: latlng, //this.latlngData,
    //       map: this.map,
    //       icon: '../../../assets/images/evegah_green.ico',
    //       zIndex: 1,
    //       clickable: true,
    //       editable: false,
    //       draggable: false,
    //     });
    //   infowindow.open(this.map,marker);

    //     // ['bounds_changed', 'dragstart', 'drag', 'dragend'].forEach(
    //     //   (eventName) => {
    //     //     google.maps.event.addListener(draw, eventName, function () {
    //   } 
       if (this.editViewData.title == 'view') {
        this.viewMode= true
    //     const marker = new google.maps.Marker({
    //       position: latlng, //this.latlngData,
    //       map: this.map,
    //       icon: '../../../assets/images/evegah_green.ico',
    //       zIndex: 1,
    //     });
    //   infowindow.open(this.map,marker);

      }

    }
    
    if(this.oldZoneData ||this.editViewData ){

    
    draw.addListener('click', (mapsMouseEvent) => {
      this.latlngData = mapsMouseEvent.latLng.toJSON();
      let infowindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });

      if (activeInfoWindow) {
        console.log(activeInfoWindow, 'marker');
        activeInfoWindow.close();
      }
      this.latlngEmitter.emit(this.latlngData);
      infowindow.close();
      infowindow.setContent(
        `<p> Area name : ${JSON.stringify(obj.name)} <br>
        Area Type : ${JSON.stringify(obj.areaType)} <br>
        City Name : ${JSON.stringify(obj.mapCityName)}<br>
        </p>
        `
        // ${JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)}
      );

      infowindow.open(this.map);
      activeInfoWindow = infowindow;
    });

  }
  }

  delete(){
    console.log(this.isChange)
    if(this.isChange){
     if(this.draw){
      this.draw.setMap(null)
      console.log(this.draw)
     }
    //  this.showLatLng();
    
    }
    
    if(this.cityandStateChange){
      if(this.draw){
        this.draw.setMap(null)
        // setMapOnAll(null)

        this.oldZoneData=[]
        this.data=[]
        this.marker=null
        this.draw=null
        console.log(this.draw, "marker", this.marker)
        console.log("state Change")
if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }
        }
          )}
          const myLatLng = { lat: Number(this.lat), lng: Number(this.lng) };

        const options = {
          center: myLatLng,
          zoom: 15,
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        };
        // this.map = new google.maps.Map(this.mapRef.nativeElement,options)
        // this.draw =(this.map)
        // console.log(this.map)
        // alert(this.cityandStateChange)
       }
       this.showLatLng();
     }
   
  }
  ngAfterViewInit() {
    //this.getAdminCurrentLocation();
    this.showLatLng();
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
    const location = new google.maps.LatLng(Number(lat), Number(lng));
    const options = {
      center: location,
      zoom: MapZoom,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });
    console.log(marker,"marker")
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
          const myLatLng = { lat: Number(this.lat), lng: Number(this.lng) };
          console.log(this.lat, this.lng);
          this.showMap(Number(this.lat), Number(this.lng)); //search
          const options = {
            center: myLatLng,
            zoom: MapZoom,
            disableDefaultUI: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          };
          // this.map = new google.maps.Map(this.mapRef.nativeElement,options)
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
          // const marker = new google.maps.Marker({
          //   position: myLatLng,
          //   map: this.map,
          //   // icon: '../../../../assets/images/evegah_green.png',
          // });

          // // Create the initial InfoWindow.
          // let infoWindow = new google.maps.InfoWindow({
          //   content: 'Click the map to get Lat/Lng!',
          //   position: myLatLng,
          // });

          // infoWindow.open(this.map, marker);

          //  this.map.addListener("click", (mapsMouseEvent) => {
          //    this.latlngData = mapsMouseEvent.latLng.toJSON()
          //    infoWindow = new google.maps.InfoWindow({
          //      position: mapsMouseEvent.latLng
          //    });

          //    this.latlngEmitter.emit(this.latlngData);
          //    infoWindow.close();
          //    infoWindow.setContent(
          //      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
          //    );
          //    infoWindow.open(this.map);

          //  });
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}
