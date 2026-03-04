import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataNotAvailable } from 'src/app/core/constants/common-constant';

@Component({
  selector: 'app-locate-button-modal',
  templateUrl: './locate-button-modal.component.html',
  styleUrls: ['./locate-button-modal.component.scss'],
})
export class LocateButtonModalComponent implements OnInit {
  bikeData: any = {};
  constructor(
    public dialogRef: MatDialogRef<LocateButtonModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data.pageValue.latitude, this.data.pageValue.longitude);
    this.bikeData = { ...this.data.pageValue };
    // this.getAddressFromBikeCordinate(this.data.pageValue)
  }
  getAddressFromBikeCordinate(data) {
    const latLng = {
      lat: Number(this.data.pageValue.latitude),
      lng: Number(this.data.pageValue.longitude),
    };
    const geocoder = new google.maps.Geocoder();
    this.setAddressInForm(geocoder, latLng);
  }

  address: any;
  addressDetail: any;
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
            else return DataNotAvailable;
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
          console.log(this.addressDetail, 'getAddress()');
          this.data.pageValue.locateBtn = true;
          this.bikeData = { ...this.addressDetail, ...this.data.pageValue };
          console.log(this.bikeData, 'ckkkkk');
        } else {
          window.alert('No results found');
        }
      })
      .catch((e) => window.alert('Geocoder failed due to: ' + e));
  }
}
