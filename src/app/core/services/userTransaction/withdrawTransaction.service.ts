
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IBikeproduce } from '../../interfaces/bikeProduce/produceBike';
@Injectable({
  providedIn: 'root',
})

export class WithdrawService {
  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }

  WithdrawDetails(requestId,id,withdrawRequestStatusEnumId):Observable<any>{
    const url = this.serverUrl + 'getWithdrawnList?requestId='+requestId+'&id='+id+'&withdrawRequestStatusEnumId='+withdrawRequestStatusEnumId+'&access_token='+ this.access_token;
    return this.http.get<IBikeproduce>(url);
  }

  

  updateWithdrawRequestFromAdmins(WithdrawDetail):Observable<any>{
    const url = this.serverUrl + 'updateWithdrawRequestFromAdmin?'+'access_token='+ this.access_token;;
    return this.http.post<IBikeproduce>(url,WithdrawDetail);
  }


  cancelWithdrawTransaction(cancelWithdrawDetail){
    const url = this.serverUrl + '/api/v1/cancelWithdrawRequestFromUser?'+'access_token='+ this.access_token;;
    return this.http.post<IBikeproduce>(url,cancelWithdrawDetail);
  }
}
