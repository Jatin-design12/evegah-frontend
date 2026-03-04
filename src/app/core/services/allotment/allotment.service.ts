
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
export class ZoneWiseListService {
 
   access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }
  
  addUpdateBikeAllotment(BikeAllotment:IBikeAllotment):Observable<any>{
    const url = this.serverUrl + 'api/v1/addUpdateBikeAllotment?'+'access_token='+ this.access_token;;
    return this.http.post<IbikeModelDetails>(url,BikeAllotment);
  }
 
  getZoneWiseList(zoneId): Observable<any> {
    const url = this.serverUrl + 'api/v1/getZoneWiseList?zoneId='+zoneId+'&access_token='+ this.access_token;
    return this.http.get<IbikeModelDetails>(url);
  }

  getAllotmentDetails():Observable<any>{
    const url = this.serverUrl + 'api/v1/getAllotmentDetails?bikeAllotmentId='+0+'&statusEnumId='+0 +'&access_token='+ this.access_token;
    return this.http.get<IbikeModelDetails>(url);
  }

  // https://admin.evegah.com/api/api/v1/getUidListWithBiekAndLock?vehicleId=54&bikeProduceAllotmentId=0&bikeZoneAllotmentAllotmentId=0&

  getUidListByVehicleIdWithDetail(vehicleId,bikeProduceAllotmentId,bikeZoneAllotmentAllotmentId):Observable<any>{
    const url = this.serverUrl + 'api/v1/getUidListWithBiekAndLock?vehicleId='+ vehicleId +'&bikeProduceAllotmentId=' +bikeProduceAllotmentId+ '&bikeZoneAllotmentAllotmentId='+bikeZoneAllotmentAllotmentId+'&access_token='+ this.access_token;
    return this.http.get<IbikeModelDetails>(url);
  }

  getUidListByVehicleId(vehicleId,bikeProduceAllotmentId,bikeZoneAllotmentAllotmentId):Observable<any>{
    const url = this.serverUrl + 'api/v1/getUidListByVehicleId?vehicleId='+ vehicleId +'&bikeProduceAllotmentId=' +bikeProduceAllotmentId+ '&bikeZoneAllotmentAllotmentId='+bikeZoneAllotmentAllotmentId+'&access_token='+ this.access_token;
    return this.http.get<IbikeModelDetails>(url);
  }
  
  getZoneWiseListByBiKeAllotment(zoneId):Observable<any>{
    const url = this.serverUrl + 'api/v1/getZoneWiseListByBiKeAllotment?zoneId=0'+ zoneId+'&access_token='+ this.access_token;
    return this.http.get<IbikeModelDetails>(url);
  }
   
  activeInactiveBikeAllotment(InactiveBikeAllotment):Observable<any>{
    const url = this.serverUrl + 'api/v1/activeInactiveBikeAllotment?'+'access_token='+ this.access_token;;
    return this.http.post<IbikeModelDetails>(url,InactiveBikeAllotment);
  }


  


  

}
