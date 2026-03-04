import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class setMinimumWalletBalance {
  access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }


  GetEnumDetails(): Observable<any> {
    const url = this.serverUrl + 'GetEnumDetail?Enum_type=' + 'Minimum Amount' + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }

  getMinimumWalletBal(): Observable<any> {
    const url = this.serverUrl + 'getMinimumWalletBalanceHistory?id=0' + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }
  getRidingAndSecurityBal(id): Observable<any> {
    const url = this.serverUrl + 'getMinimumWalletBalanceHistory?'+ '&id=' + id + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }
  MinimumWalletBalanceValue(data): Observable<any> {
    const url = this.serverUrl + 'updateUserMinimumWalletBalanceValues?' + 'access_token=' + this.access_token;
    return this.http.post<any>(url, data);
  }
  
  getDepositAndRidingAmount(): Observable<any> {
    const url = this.serverUrl + 'getDepositAndRidingOrRechargeAmount?' + 'access_token=' + this.access_token;
    return this.http.get<any>(url);
  }

  getVesionUpdateList(): Observable<any> {
    const url = this.serverUrl + 'api/v1/getVersionHistory';
    return this.http.get<any>(url);
  }
}