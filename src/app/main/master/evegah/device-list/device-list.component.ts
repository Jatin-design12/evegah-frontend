import { EvegahService } from '../../../../core/services/evegah/evegah.services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EDIT } from 'src/app/core/constants/common-constant';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  cols = [];
  rowData = [];
  subscription: Subscription[] = [];
  constructor(private evegahService: EvegahService, public router: Router) { }

  ngOnInit(): void {
    this.tableColumnData()
    this.getDeviceList();
  }
  tableColumnData() {

    this.cols = [
      {
        key: 'sno', display: 'S.No.', sort: false, config: { isIndex: true }

      },
      {
        key: 'deviceName', display: 'Name', sort: true,

      },
      {
        key: 'latitude', display: 'Latitude', sort: true,

      },
      {
        key: 'longitude', display: 'Longitude', sort: true,

      },
      {
        key: 'deviceStatus', display: 'Status', sort: true
      },
      {
        key: 'action',
        display: 'Action',
        sort: false,
        config: { isAction: true, actions: [EDIT] },
      },


    ]
  }
  getDeviceList() {
    this.subscription.push(this.evegahService.getDeviceList().subscribe(data => {
      this.rowData = data.data;
      this.rowData.forEach(element => {
         if(element.deviceStatus == '1'){
          element.deviceStatus = 'Lock';
         }else{
          element.deviceStatus = 'UnLock';
         }
      });
    }))
  }
  onActionHandler(event) {
    if (event.action === 'edit') {
      this.editDevice(event.data)
    }
  }
  editDevice(data) {
    sessionStorage.setItem('device', JSON.stringify(data))
    this.router.navigate(['./evegah/detail']);
  }
  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}
