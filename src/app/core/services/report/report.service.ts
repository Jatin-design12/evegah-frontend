import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITestLock } from '../../interfaces/test-lock';
import { ClientMetro } from '../../constants/common-constant';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }


  getUserWiseRideEarningReport(data): Observable<any> {
    const url = this.serverUrl + `api/v1/getUserWiseRideEarningReport?access_token=${this.access_token}`
    return this.http.post<any>(url, data);
  }

  getbikeWiseRideEarningReport(data): Observable<any> {
    const url = this.serverUrl + `api/v1/getbikeWiseRideEarningReport?access_token=${this.access_token}`
    return this.http.post<any>(url, data);
  }

  getRideEarningDetailReport(data): Observable<any> {
    const url = this.serverUrl + `api/v1/getRideEarningDetailReport?access_token=${this.access_token}`
    return this.http.post<any>(url, data);
  }

  GetEnumDetails(EnumType: any): Observable<any> {
    const url = this.serverUrl + 'GetEnumDetail?Enum_type=' + EnumType + '&access_token=' + this.access_token;
    return this.http.get<any>(url);

  }

  GetlockUnclockStatus(): Observable<any> {
    const url = this.serverUrl + '/getLockStatusList?&access_token=' + this.access_token;
    return this.http.get<any>(url);

  }



  getUserIdRideEarningReport(data): Observable<any> {
    const url = this.serverUrl + `api/v1/getRideEarningDetailReport?access_token=${this.access_token}`
    return this.http.post<any>(url, data);
  }

  getbikeIdRideEarningReport(data): Observable<any> {
    const url = this.serverUrl + `api/v1/getRideEarningDetailReport?&access_token=${this.access_token}`
    return this.http.post<any>(url, data);
  }


  // test lock 
  getTestLockDetail(lockId, lock_unlockStatusId, EnumId, beepStatusId): Observable<any> {
    const url = this.serverUrl + `getLockDetailForTestPage?lockNumber=${lockId}&deviceLockAndUnlockStatus=${lock_unlockStatusId}&deviceLightStatusEnumId=${EnumId}&beepStatusEnumId=${beepStatusId}&access_token=${this.access_token}`
    return this.http.get<any>(url);
  }


  // https://admin.evegah.com/api/api/v1/getDeviceLogInfoReport?lockId=2136&fromDate=2023-11-28&toDate=2023-11-29&speed=available&latitude=available&longitude=available&battery=available&internal_batt_v=available&external_batt_v=available&altitude=available&deviceLightStatusEnumId=available&deviceLightInstructionEnumId=available&instructionId=available&deviceLockAndUnlockStatus=available
  // not available
  // available
  // both
  getHistryBtnData(obj: any, clientName: string) {
    let url = this.serverUrl + `api/v1/getDeviceLogInfoReport?lockId=${obj.lockId}&fromDate=${obj.fromDate}&toDate=${obj.toDate}&speed=${obj.speed}&latitude=${obj.latitude}&longitude=${obj.longitude}&battery=${obj.battery}&internal_batt_v=${obj.internal_batt_v}&external_batt_v=${obj.external_batt_v}&altitude=${obj.altitude}&deviceLightStatusEnumId=${obj.deviceLightStatusEnumId}&deviceLightInstructionEnumId=${obj.deviceLightInstructionEnumId}&instructionId=${obj.instructionId}&deviceLockAndUnlockStatus=${obj.deviceLockAndUnlockStatus}&beepInstructionEnumId=${obj.beepInstructionEnumId}&beepStatusEnumId=${obj.beepStatusEnumId}&rowCount=${obj.rowCount}&sort=${obj.sort}&access_token=${this.access_token}`;

    if (clientName === ClientMetro) {
      url = this.serverUrl + `api/v1/getDeviceLogInfoReport?lockId=${obj.lockId}&fromDate=${obj.fromDate}&toDate=${obj.toDate}&speed=${obj.speed}&latitude=${obj.latitude}&longitude=${obj.longitude}&battery=${obj.battery}&deviceLockAndUnlockStatus=${obj.deviceLockAndUnlockStatus}&rowCount=${obj.rowCount}&sort=${obj.sort}&access_token=${this.access_token}`;
    }

    return this.http.get<any>(url);
  }

  getHistorytableDataByLockId(lockId: number, fromDate: string, toDate: string): Observable<any> {
    const url = this.serverUrl + `api/v1/getDeviceLogInfoReport?lockId=${lockId}&fromDate=${fromDate}&toDate=${toDate}&deviceLockAndUnlockStatus=available&rowCount=10&sort=asce&access_token=${this.access_token}`;
    return this.http.get<any>(url);
  }
  //  new  format  reports
  getMapState(Id: number): Observable<any> {
    const url = this.serverUrl + 'getMapState?mapCountryId=' + Id + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }
  getMapCity(statesId: any[]): Observable<any> {
    const data = {
      mapStateId: statesId
    }
    const url = this.serverUrl + 'getMapCityDetailForReport?access_token=' + this.access_token;
    return this.http.post<any>(url, data);
  }
  getMapArea(data): Observable<any> {
    const url = this.serverUrl + 'getMapAreaDetailForReport?access_token=' + this.access_token;
    return this.http.post<any>(url, data);
  }
  getZoneList(data): Observable<any> {
    const url = this.serverUrl + 'getZoneDetailForReport?access_token=' + this.access_token;
    return this.http.post<any>(url, data);
  }
}
