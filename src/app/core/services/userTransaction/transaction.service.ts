
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IBikeproduce } from '../../interfaces/bikeProduce/produceBike';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }
  

  TransactionDetails(userId):Observable<any>{
    const url = this.serverUrl + 'getLatestTransactionList?id='+userId+'&access_token='+ this.access_token;
    return this.http.get<IBikeproduce>(url);
  }
}
