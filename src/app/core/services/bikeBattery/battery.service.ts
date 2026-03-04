
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { IbikeModelDetails } from '../../interfaces/bikeInward/addbikeinward';
import { IBikeAllotment } from '../../interfaces/bikeAllotment/bikeAllortment';

@Injectable({
  providedIn: 'root',
})
export class BatteryService {  
   access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }
  

  BatteryPercentageApis(BatteryPer:Number, map:any):Observable<any>{
    const url = this.serverUrl + 'getProduceBikeBatteryStatus?bikeBatteryStatus='+BatteryPer+'&'+'access_token='+ this.access_token+'&mapCityName='+map.mapCityName+'&mapStateName='+map.mapStateName+'&mapCountryName='+map.mapCountryName ;
    return this.http.get<IbikeModelDetails>(url);
  }
   
  BatteryPercentageApi():Observable<any>{
    const url = this.serverUrl + 'getProduceBikeBatteryStatus?bikeBatteryStatus='+100+'&'+'access_token='+ this.access_token;
    return this.http.get<IbikeModelDetails>(url);
  }


}
