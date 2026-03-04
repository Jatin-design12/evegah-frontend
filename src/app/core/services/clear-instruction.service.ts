import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClearInstructionService {

  access_token: string = JSON.parse(sessionStorage.getItem('user')).access_token;
  serverUrl: string = '';

  constructor(
    private http: HttpClient
  ) {
    this.serverUrl = environment.apiUrl;
  }

  clearLockInstructions(params: any) {
    const url = `${this.serverUrl}clearInstructionForLockUnlock?access_token=${this.access_token}`;
    return this.http.post<any>(url, params);
  }

  clearLightInstructions(params: any) {
    const url = `${this.serverUrl}clearInstructionForLightOnOff?access_token=${this.access_token}`;
    return this.http.post<any>(url, params);
  }

}
