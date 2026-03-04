import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetroDeviceService {

  access_token: string = JSON.parse(sessionStorage.getItem('user')).access_token;
  serverUrl: string = '';

  constructor(
    private http: HttpClient
  ) {
    this.serverUrl = environment.apiUrl;
  }

  deviceLock(params: any) {
    const url = `${this.serverUrl}mb/deviceLockForThirdParty?access_token=${this.access_token}`;
    return this.http.post<any>(url, params);
  }

  deviceUnlock(params: any) {
    const url = `${this.serverUrl}mb/deviceUnlockForThirdParty?access_token=${this.access_token}`;
    return this.http.post<any>(url, params);
  }

  powerOn(params: any) {
    const url = `${this.serverUrl}mb/devicePowerOnForThirdParty?access_token=${this.access_token}`;
    return this.http.post<any>(url, params);
  }

  powerOff(params: any) {
    const url = `${this.serverUrl}mb/devicePowerOffForThirdParty?access_token=${this.access_token}`;
    return this.http.post<any>(url, params);
  }

}
