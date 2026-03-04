import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBikeStatusUnresurvedData } from '../../interfaces/dashboard/bike-status-unresurved-data';
import { IBikeUndermaintenanceData } from '../../interfaces/dashboard/bike-undermaintenance-data';
import { Observable } from 'rxjs';
import { IMapSearch } from '../../interfaces/dashboard/map-search';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }


  bikeUnresurved(IbikeModelDetails: IBikeStatusUnresurvedData): Observable<any> {
    const url = this.serverUrl + 'api/v1/updateBikeStatusUnresurved?access_token=' + this.access_token;
    return this.http.post<IBikeStatusUnresurvedData>(url, IbikeModelDetails);
  }
  bikeUndermaintenance(IbikeModelDetails: IBikeUndermaintenanceData): Observable<any> {
    const url = this.serverUrl + 'api/v1/updateBikeUndermaintenance?access_token=' + this.access_token;
    return this.http.post<IBikeUndermaintenanceData>(url, IbikeModelDetails);
  }

  getBikeMaintenceList(map:any): Observable<any> {
    const url = this.serverUrl + 'api/v1/getUndermaintenanceBikeList?access_token=' + this.access_token+'&mapCityName='+map.mapCityName+'&mapStateName='+map.mapStateName+'&mapCountryName='+map.mapCountryName//'&zoneId='+zoneId;
    return this.http.get<any>(url);
  }

  
  getOutsideGeoFencingList(map:any): Observable<any> {
    const url = this.serverUrl + 'getOutSideGeoFanceBikeList?access_token=' + this.access_token+'&mapCityName='+map.mapCityName+'&mapStateName='+map.mapStateName+'&mapCountryName='+map.mapCountryName//'&zoneId='+zoneId;
    return this.http.get<any>(url);
  }

  getBikeByZoneIdForMap(id:number): Observable<any> {
    const url = this.serverUrl + 'getBikeDetailZoneWiseForMap?zoneId='+id+'&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }



  getBikeMaintenceListbyLockId(map:any): Observable<any> {
    const url = this.serverUrl + 'api/v1/getUndermaintenanceBikeList?access_token=' + this.access_token+'&mapCityName='+map.mapCityName+'&mapStateName='+map.mapStateName+'&mapCountryName='+map.mapCountryName+'&lockId='+map.lockId; //'&zoneId='+zoneId;
    return this.http.get<any>(url);
  }
  getActiceListbyRideId(map:any): Observable<any> {
    const url = this.serverUrl + 'api/v1/getRideBookedList?access_token=' + this.access_token+'&mapCityName='+map.mapCityName+'&mapStateName='+map.mapStateName+'&mapCountryName='+map.mapCountryName+'&rideBookingId='+map.rideId; //'&zoneId='+zoneId;
    return this.http.get<any>(url);
  }
  getBikeAvailableListbyLockId(map:any): Observable<any> {
    const url = this.serverUrl + 'api/v1/getAvaialableBikeList?access_token=' + this.access_token+'&mapCityName='+map.mapCityName+'&mapStateName='+map.mapStateName+'&mapCountryName='+map.mapCountryName+'&lockId='+map.lockId; //'&zoneId='+zoneId;
    return this.http.get<any>(url);
  }

  getActiceBikeListbyuserIdandLockId(userId,lockId): Observable<any> {
    const url = this.serverUrl + 'getRideBookingByUserIdAndLockNo?userId='+userId+'&statusEnumId=1&lockId='+lockId+'&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }


  getLatestTransactionList(userId): Observable<any> {
    const url = this.serverUrl + 'getLatestTransactionList?id=&'+userId+'&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }

  getLastTenTransactionList(userId): Observable<any> {
    const url = this.serverUrl + 'getLastTenTransactionList?id='+userId+'&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }
}
