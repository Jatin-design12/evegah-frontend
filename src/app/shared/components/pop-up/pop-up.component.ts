import { Component, Inject, OnInit, Optional } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ProduceBikeService } from '../../../core/services/produceBike/produceBike.service'
import { EndRideBikeModel } from 'src/app/core/models/dashboard/endRideBikeModel';
import { ToastrService } from 'ngx-toastr';
import { MetroDeviceService } from 'src/app/core/services/metro-device.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ClientMetro } from 'src/app/core/constants/common-constant';
@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  QRcode: any;
  qr: boolean = false;
  endRide: boolean = false;
  remark = ''
  subscription: Subscription[] = []
  endBikeModel = new EndRideBikeModel()


  constructor(
    private sanitizer: DomSanitizer, private ProduceBikeService: ProduceBikeService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<PopUpComponent>,
    private metroDeviceServices: MetroDeviceService,
    private spinner: NgxSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    console.log(this.data.pageValue)
    if (this.data.pageValue === "endRide") {
      this.qr = false;
      this.endRide = true;
    } else {
      this.qr = true;
      this.endRide = false;
      this.QRcode = this.sanitizer.bypassSecurityTrustResourceUrl(data.pageValue);
    }
  }

  userData: any = []

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user'))
    console.log(this.userData, "usrData")
  }

  deviceLock(lockNumber: string) {

    const params = {
      lockNumber,
      userId: this.userData.id,
      autoActionType: environment.autoLockUnlock
    };

    this.subscription.push(
      this.metroDeviceServices.deviceLock(params).subscribe((res) => {

        this.spinner.hide();

        if (res.statusCode === 200) {
          this.toastr.success('Ride ended, power off and device locked.');
        } else {
          this.toastr.warning(res.message);
        }

      })
    );

  }

  powerOff(lockNumber: string) {

    const params = {
      lockNumber,
      userId: this.userData.id,
      autoActionType: environment.autoLockUnlock
    };

    this.subscription.push(
      this.metroDeviceServices.powerOff(params).subscribe((res) => {
        if (res.statusCode === 200) {
          const delayInterval = +res.data.IntervalTime;

          setTimeout(() => {
            this.deviceLock(lockNumber);
          }, delayInterval * 1000);

        } else {
          this.spinner.hide();
          this.toastr.warning(res.message);
        }
      })
    );

  }

  endRideBike() {

    console.log("checkndd", this.data, this.data.bikeId)
    this.endBikeModel.bikeId = this.data.lockNumber.bikeId
    this.endBikeModel.rideBookingId = this.data.lockNumber.booking_id
    this.endBikeModel.id = this.data.lockNumber.id
    this.endBikeModel.extraCharges = 0
    this.endBikeModel.actualRideTime = '0'
    this.endBikeModel.rideEndLatitude = this.data.lockNumber.latitude
    this.endBikeModel.rideEndLongitude = this.data.lockNumber.longitude
    this.endBikeModel.remarks = this.remark
    this.endBikeModel.endRideUserId = this.userData.id  // admin Id 
    console.log(this.endBikeModel, "model")
    //  return this.endBikeModel

    this.spinner.show();

    this.subscription.push(this.ProduceBikeService.endRideBike(this.endBikeModel).subscribe((res) => {
      if (res.statusCode === 200) {

        this.dialogRef.close(true);

        if (environment.clientName === ClientMetro) {
          this.powerOff(this.data.lockNumber?.lockNumber);
        } else {
          this.spinner.hide();
          this.toastr.success('Ride ended successfully.');
        }

      }
      else {
        // this.closemodel()
        this.dialogRef.close(false);

      }
    }))
    // this.dialogRef.close(true);
    // this.closemodel()
  }

  closemodel() {

    this.dialogRef.close(PopUpComponent)
  }

}
