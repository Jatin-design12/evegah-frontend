
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
//import { IMobileNumber } from '../interfaces/session/mobileNumber';
import { IbikeModelDetails } from '../../interfaces/bikeInward/addbikeinward';
import { IBikeAllotment } from '../../interfaces/bikeAllotment/bikeAllortment';
import { environment } from 'src/environments/environment';
import { IBikeproduce } from '../../interfaces/bikeProduce/produceBike';
import { IEndBikeRideData } from '../../interfaces/dashboard/end-bike-ride-data';
import { IMapSearch } from '../../interfaces/dashboard/map-search';
import { ICommonResponse } from '../../interfaces/common/common-response';
@Injectable({
  providedIn: 'root',
})
export class ProduceBikeService {
  access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }

  addUpdateBikeProduce(IBikeproduce: IBikeproduce): Observable<any> {
    const url = this.serverUrl + 'api/v1/addUpdateBikeProduce?' + 'access_token=' + this.access_token;
    return this.http.post<IBikeproduce>(url, IBikeproduce);
  }
  getBikeProduceDetails(): Observable<any> {
    const url = this.serverUrl + 'api/v1/getBikeProduceDetails?bikeProduceId=' + 0 + '&statusEnumId=' + 0 + '&access_token=' + this.access_token;
    return this.http.get<IBikeproduce>(url);
  }

  getActiveBookBikeDetails(map:any): Observable<any> {
    const url = this.serverUrl + 'api/v1/getRideBookedList?access_token=' + this.access_token+'&mapCityName='+map.mapCityName+'&mapStateName='+map.mapStateName+'&mapCountryName='+map.mapCountryName//'&zoneId='+zoneId;
    return this.http.get<IBikeproduce>(url);
  }

  getAvaialableBikeList(map:any): Observable<any> {
    const url = this.serverUrl + 'api/v1/getAvaialableBikeList?access_token=' + this.access_token+'&mapCityName='+map.mapCityName+'&mapStateName='+map.mapStateName+'&mapCountryName='+map.mapCountryName//'&zoneId='+zoneId;
    return this.http.get<any>(url);
  }


  // For End Bike 
  endRideBike(endRideBike: IEndBikeRideData): Observable<any> {
    const url = this.serverUrl + 'api/v1/updateDetailsRideEnds?'+ 'access_token=' + this.access_token;;
    return this.http.post<IBikeproduce>(url, endRideBike);
  }

  // for detect the location of Device
  getCurrentLocOfDevice(deviceId: any): Observable<any> {
    const encodedDeviceId = encodeURIComponent(String(deviceId || '').trim());
    const url = this.serverUrl + 'api/v1/getLatLogList?searchRef=' + encodedDeviceId + '&exactOnly=1&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }



  


// {
//   "statusEnumId": 2,
//   "bikeId": 16
// }

changeBikeStatusActiveDeactive(data):Observable<ICommonResponse>{
  const url = this.serverUrl + 'bikeProduceActiveDeactive?'+'access_token='+ this.access_token;
  return this.http.post<ICommonResponse>(url, data);
}
}
