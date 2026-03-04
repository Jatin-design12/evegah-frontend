
//import { IAddlockModelDetails } from '../../interfaces/lockInward/addLockInward';

/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
//import { IMobileNumber } from '../interfaces/session/mobileNumber';
import { IlockModelDetailss } from '../../interfaces/lockInward/lockInward';
import { environment } from 'src/environments/environment';
import { ICommonResponse } from '../../interfaces/common/common-response';
import { IGetLockInward } from '../../interfaces/lockInward/list';

@Injectable({
  providedIn: 'root',
})
export class LockService {
  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }

  addLockModelDetails(IlockModelDetails: IlockModelDetailss): Observable<ICommonResponse> {
    const url = this.serverUrl + 'api/v1/addUpdateLockInward?'+'access_token='+ this.access_token;;
    return this.http.post<ICommonResponse>(url, IlockModelDetails);
  }

  getLockDetails(lockInwardId:number,statusEnumId): Observable<IGetLockInward> {
    const url = this.serverUrl + 'api/v1/getLockInwardDetails?lockInwardId='+lockInwardId+"&statusEnumId="+statusEnumId +'&access_token='+ this.access_token;
    return this.http.get<IGetLockInward>(url);
  }
  
  getLockLists(): Observable<any> {
     const url = this.serverUrl + 'api/v1/getLockList?'+'access_token='+ this.access_token;
     return this.http.get<IlockModelDetailss>(url);
   }

  changeLockStatus(data):Observable<ICommonResponse>{
    const url = this.serverUrl + 'api/v1/activeInactiveLockInward?'+'access_token='+ this.access_token;
    return this.http.post<ICommonResponse>(url, data);
  }
  deleteLockInward(lockData):Observable<any> {
    const url = this.serverUrl + 'deleteLockInward?'+'access_token='+ this.access_token;
    return this.http.post<any>(url,lockData);
  }


}
