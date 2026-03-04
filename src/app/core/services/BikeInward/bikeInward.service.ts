
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
//import { IMobileNumber } from '../interfaces/session/mobileNumber';
import { IbikeModelDetails } from '../../interfaces/bikeInward/addbikeinward';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BikeModelService {
  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }


  bikeModelDetails(IbikeModelDetails: IbikeModelDetails): Observable<any> {
    const url = this.serverUrl + 'api/v1/addUpdateBikeInward?'+'access_token='+ this.access_token;;
    return this.http.post<IbikeModelDetails>(url, IbikeModelDetails);
  }

  getBikeModelDetails(bikeInwardId:number,statusEnumId,bikeStatusEnumId): Observable<any> {
    const url = this.serverUrl + 'api/v1/getBikeInwardDetails?bikeInwardId='+bikeInwardId+"&statusEnumId="+statusEnumId+"&bikeStatusEnumId="+bikeStatusEnumId+'&access_token='+ this.access_token  ;
    return this.http.get<IbikeModelDetails>(url);
  }

  activeInactiveBikeAllotment(data): Observable<any> {

    const url = this.serverUrl + 'api/v1/activeInactiveBikeAllotment?'+'access_token='+ this.access_token;;
    return this.http.post<IbikeModelDetails>(url, data);
  }

  activeInactiveBikeInward(data): Observable<any> {

    const url = this.serverUrl + 'api/v1/activeInactiveBikeInward?'+'access_token='+ this.access_token;;
    return this.http.post<IbikeModelDetails>(url, data);
  }
}
