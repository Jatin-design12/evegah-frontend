
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IGetCity } from '../interfaces/common/city';
import { ICommonResponse } from '../interfaces/common/common-response';
import { IGetCountry } from '../interfaces/common/country';
import { IHistoryData } from '../interfaces/common/history-response';
import { ISection } from '../interfaces/common/section';
import { IGetState } from '../interfaces/common/state';
import { IGetUnit } from '../interfaces/common/unit';

@Injectable({
  providedIn: 'root',
})                       
export class CommonService {
  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
  constructor(private http: HttpClient) { }
  serverEndPoint = environment.apiUrl;


  uploadImage(file) {
    const formData = new FormData();
    for (var i = 0; i < file.length; i++) { 
      formData.append("file", file[i]);
    }
    const url = this.serverEndPoint + 'fileUpload';
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  deleteImage(fileName): Observable<ICommonResponse> {
    const url = this.serverEndPoint + 'fileDelete';
    return this.http.post<ICommonResponse>(url, fileName)
  }
  getHistoryDetail(masterName: string, masterId: Number): Observable<IHistoryData> {
    const url = this.serverEndPoint + 'getMasterRemarkByMasterNameAndMasterId?masterName=' + masterName + '&mastersId=' + masterId;
    return this.http.get<IHistoryData>(url)
  }


  getCountryList(): Observable<IGetCountry> {
    const url = this.serverEndPoint + 'getCountry?'+'access_token='+ this.access_token;
    return this.http.get<IGetCountry>(url);
  }
  
  getStateList(id: Number): Observable<IGetState> {
    const url = this.serverEndPoint + 'getStates?country_id=' + id+'&access_token='+ this.access_token;
    return this.http.get<IGetState>(url);
  }


  getCityList(id: Number): Observable<IGetCity> {
    const url = this.serverEndPoint + 'getCities?state_id=' + id+'&access_token='+ this.access_token;
    return this.http.get<IGetCity>(url);
  }

  
  getUnitList(): Observable<IGetUnit> {
    const url = this.serverEndPoint + 'api/v1/getUnit?unitId='+0+'&statusEnumId='+0+'&access_token='+ this.access_token;
    return this.http.get<IGetUnit>(url);
  }
  convertDate(date: Date) {
    
    if(date !== null && date !== undefined) {
      const formattedDate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
      return formattedDate
    }else{
      return null;
    }
  
  }
  getSectionList() {
    const url = this.serverEndPoint + 'getSectionList?'+'access_token='+ this.access_token;
    return this.http.get<ISection>(url);
  }
  checkUserAccessControlForNavBar(page) {
    let userAccessData = JSON.parse(sessionStorage.getItem('userAccessData'));
    if(userAccessData == null) {
      return true;
    }
    let flag = false;
    if(userAccessData.find(x => x.module == page).isSelected === true) {
      flag = true;
    }
    return flag;
  }
  checkUserAccessControlForNavItem(page, item) {
    let userAccessData = JSON.parse(sessionStorage.getItem('userAccessData'));
    if(userAccessData == null) {
      return true;
    }
    let flag = false;
    let pageData = userAccessData.find(x => x.module == page).data;
    let itemData = pageData.find(x => x.page_name == item);
    if(itemData.add || itemData.view || itemData.edit || itemData.delete) {
      flag = true;
    }
    return flag;
  }
  checkUserAccessControlForAction(module, page, action) {
    let userAccessData = JSON.parse(sessionStorage.getItem('userAccessData'));
    if(userAccessData == null) {
      return true;
    }
    let pageData = userAccessData.find(x => x.module == module).data;
    let itemData = pageData.find(x => x.page_name == page);
    return itemData[action]

  }

/// check client name
  checkClientName(){
    if (
      environment.clientName == undefined ||
      environment.clientName == null ||
      environment.clientName == ''
    ) {
      return null;
    } else {
      return environment.clientName;
    } 
  }


}
