import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ProduceBikeService} from '../../../core/services/produceBike/produceBike.service'
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  styles: [`
    :host {
      display: block;
   
      border-radius: 8px;
      padding: 16px;
    
    }
  `]
})
export class MapModalComponent implements OnInit , OnDestroy {
  lat: number;
  zoom: number;
  lng: number;
  locateLat : number;
  locateLng : number
  intervals:any
  subscription:Subscription[]=[]

  latitude: number;
  longitude: number;
  address: string;
  private geoCoder;
  public origin: any;
  public destination: any;
  optimizeWaypoints: boolean = true; 
  dir = {  origin: {
    lat:0, lng:0, icon:{},label: 'start'
  },destination: {
    lat:0, lng:0, icon:{},label: 'End'
  } }
  renderOptions = { suppressMarkers: true}
  isMarkersVisible = true;     
  myLocationIconUrl = "../../../../../assets/images/blue-circle.png";

 

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
}

  constructor(  
    public dialogRef: MatDialogRef<MapModalComponent>,private toastr: ToastrService,
    public ProduceBikeService :ProduceBikeService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { 
      
    }

  ngOnInit(): void {
    console.log( this.data.pageValue)
    // this.setCurrentLocation();
    this.geoCoder = new google.maps.Geocoder;   

    if((this.data.pageValue.latitude === null || this.data.pageValue.latitude === '') || (this.data.pageValue.longitude  === null || this.data.pageValue.longitude  === '')){
      this.lat =  22.6777004;
      this.zoom = 2;
      this.lng = 75.8258323;
    }
    //else{
    //   this.zoom = 6;
    //   this.latitude = this.data.pageValue.latitude 
    //   this.longitude = this.data.pageValue.longitude
    //   this.lat =  22.6777004;
    //   this.lng = 75.8258323;
    //   console.log(this.data.pageValue.latitude ,this.data.pageValue.longitude, this.lat,this.lng)

      
    // }

    this.dir = {
      origin: { lat: Number(this.data.pageValue.latitude), lng: Number(this.data.pageValue.longitude) ,icon:
        {
          url: '',
          scaledSize: {
              width: 40,
              height: 40
          }
      },label: 'start' },
      destination: { lat: Number(this.data.pageValue.latitude)+0.2, lng: Number(this.data.pageValue.longitude)+0.2,icon:
        {
          url: '',
          scaledSize: {
              width: 40,
              height: 40
          }
      }, label: 'End'}
    }

    console.log(this.dir,"thisnksdjkl")
    let i=0
    this.getCurrentLocation()


    this.intervals=   setInterval(()=>{
      i =i+0
      this.getCurrentLocation()

    },
    5000
    )

    
  }

  getLocation:any=[]
  getCurrentLocation(){
    // console.log('check')
    this.subscription.push(this.ProduceBikeService.getCurrentLocOfDevice(this.data.pageValue.lockNumber).subscribe((res) => {
      if (res.statusCode === 200) {
        // console.log(res.data)
         this.getLocation = res.data;
        //  this.locateLat = Number(this.getLocation[0].latitude) 
        //  this.locateLat = Number(this.getLocation[0].longitude)
        //  this.lat =  22.718281+i; //this.getLocation[0].latitude//
        //  this.lng = 75.855324+1;  //this.getLocation[0].longitude//

         this.latitude = Number(this.getLocation[0].latitude)//Number(this.getLocation[0].latitude) +i
         this.longitude = Number(this.getLocation[0].longitude)//Number(this.getLocation[0].longitude) +i
         
         this.dir.destination.lat = this.latitude
         this.dir.destination.lng = this.longitude
        //  console.log(this.getLocation, this.locateLng ,  this.locateLat)

        //  this.checklocationArrived( this.latitude,this.longitude)
         
        //  this.setCurrentLocation()
        } else if (res.statusCode === 422) {
        this.toastr.warning(res.message)
      }
      else {
        this.toastr.warning(res.message);
      }
    }))
  }

  checklocationArrived( latitude,longitude){

    // console.log(this.dir.destination.lat, 'dgdgd')
    
    if(this.dir.destination.lat === latitude && this.dir.destination.lng === longitude){
      clearInterval(this.intervals)
       this.dir.origin.lat=latitude
       this.dir.origin.lng=longitude
    }
  }


   // Get Current Location Coordinates
   private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position, this.lat,this.lng)
        // this.latitude = this.lat//position.coords.latitude;
        // this.longitude = this.lng//position.coords.longitude;
        // this.getAddress(this.latitude, this.longitude);
      });
    }

  
  }

  markerDragEnd($event: any) {
    console.log("d;lkgdk")
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    // this.getAddress(this.latitude, this.longitude);
  }

  

  ngOnDestroy(){
    clearInterval(this.intervals)
  }

}



