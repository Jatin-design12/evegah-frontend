import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ICommonResponse } from '../../interfaces/common/common-response';

@Injectable({
  providedIn: 'root'
})
export class EvegahService {
  userData = JSON.parse(sessionStorage.getItem('user'));

  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
  
  constructor(private http: HttpClient) { }

  serverEndPoint = environment.apiUrl

  getDeviceList(): Observable<any> {
    const url = this.serverEndPoint + 'getDevice?deviceName=test'+'&access_token='+ this.access_token
    return this.http.get<any>(url);
  }

  changeStatus(data):Observable<any> {
    const url = this.serverEndPoint + 'lockAndUnlockDevice?deviceName=' +data.deveiceName+ '&deviceStatus='+data.deviceStatus+'&access_token='+ this.access_token;
    return this.http.get<ICommonResponse>(url);
  }

}
