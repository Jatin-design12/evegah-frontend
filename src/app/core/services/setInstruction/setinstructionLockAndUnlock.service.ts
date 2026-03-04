
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
export class setInstruction {
  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }

  setInstructionToLockUnlock(deviceId:number,instructionId): Observable<IGetLockInward> {
    const url = this.serverUrl + 'setInstructionToLockUnlockDevice?deviceId=' + deviceId + '&instructionId=' +instructionId +'&access_token='+ this.access_token;
    return this.http.get<IGetLockInward>(url);
  }
  
  lockInstructionapi(deviceId){
    const url = this.serverUrl + 'lockDevice?dId=' + deviceId + '&lockStatus=' +2 +'&access_token='+ this.access_token;
    return this.http.get<IGetLockInward>(url);
  }

  unlockInstructionapi(deviceId){
    const url = this.serverUrl + 'unlockDevice?dId=' + deviceId + '&lockStatus=' +1 +'&access_token='+ this.access_token;
    return this.http.get<IGetLockInward>(url);
  }

  onLightInstructionapi(data){
    let deviceId=data.deviceId
    let userId= data.userId
    
    const url = this.serverUrl + 'setDeviceLightOnInstruction?deviceId=' + deviceId + '&userId=' +userId +'&access_token='+ this.access_token;
    return this.http.post<any>(url, data);
  }

  offLightInstructionapi(data){
    let deviceId=data.deviceId
    let userId= data.userId
    const url = this.serverUrl + 'setDeviceLightOffInstruction?deviceId=' + deviceId + '&userId=' +userId +'&access_token='+ this.access_token;
    return this.http.post<any>(url,data);
  }

//   localhost:9001/api/setDeviceLightOnInstruction?deviceId=EDELTEMP28&userId=10&access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxIiwiaWF0IjoxNjk5NDQwMTc4LCJleHAiOjE3MDAzMDQxNzh9.LbBj-8_jtrBU_JNErVtepzayIo0Qa8qj2G8sQZ9MveU
// {"userId":15,"deviceId":"EDELTEMP28"}

// localhost:9001/api/setDeviceLightOffInstruction?deviceId=EDELTEMP28&userId=10&access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxIiwiaWF0IjoxNjk5NDQwMTc4LCJleHAiOjE3MDAzMDQxNzh9.LbBj-8_jtrBU_JNErVtepzayIo0Qa8qj2G8sQZ9MveU
// {"userId":186,"deviceId":"EDELTEMP28"}


onBeepInstructionapi(data){
  let deviceId=data.deviceId
  let userId= data.userId
  
  const url = this.serverUrl + 'setBeepOnInstruction' +'?access_token='+ this.access_token;
  return this.http.post<any>(url, data);
}

offBeepInstructionapi(data){
  
  const url = this.serverUrl + 'setBeepOffInstruction'+'?access_token='+ this.access_token;
  return this.http.post<any>(url,data);
}
}
