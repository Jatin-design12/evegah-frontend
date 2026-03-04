import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-draw-area',
  templateUrl: './draw-area.component.html',
  styleUrls: ['./draw-area.component.scss']
})
export class DrawAreaComponent implements OnInit {

  constructor() { }
  latitude: number;
  longitude: number;
  ngOnInit(): void {
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position,)
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // this.getAddress(this.latitude, this.longitude);
      });
    }

}
}
