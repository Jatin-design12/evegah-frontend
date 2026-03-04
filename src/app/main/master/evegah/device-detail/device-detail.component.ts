import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { EvegahService } from 'src/app/core/services/evegah/evegah.services';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit, OnDestroy {
  deviceData: any = {};
  subscription: Subscription[] = [];
  constructor(private evegahService: EvegahService, private toastr: ToastrService, public router: Router) {}

  ngOnInit(): void {
    
    this.deviceData = JSON.parse(sessionStorage.getItem('device'))
  }

  lockUnlock(data) {
    const temp = {
      deveiceName: this.deviceData.deviceName,
      deviceStatus: data
    }
   
    this.subscription.push(this.evegahService.changeStatus(temp).subscribe((res) => {
      if (res.statusCode === 200) {
        if (data === '1') {
          this.deviceData.deviceStatus = 1;
        } else {
          this.deviceData.deviceStatus = 2;
        }
        this.router.navigate(['./evegah'])
        this.toastr.success(res.message)
      }
      this.deviceData
    }))

  }

  backBtn() {
    this.router.navigate(['./evegah'])
  }
  
  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}
