import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAreaData } from 'src/app/core/interfaces/master/area/area-data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }

  // For ADD UPDate Master
  addUpdateArea(areaModel: IAreaData): Observable<any> {
    const url = this.serverUrl + 'api/v1/addUpdateAreaDetail?access_token=' + this.access_token;
    return this.http.post<IAreaData>(url, areaModel);
  }

  // GET AREA DETAIL
  getAreaDetail(Id: number): Observable<any> {
    const url = this.serverUrl + 'api/v1/getAreaDetails?areaId=' + Id + '&access_token=' + this.access_token;;
    return this.http.get<any>(url);
  }


  // Get Area by cityId or areaId getAreaDetails?areaId=0&cityId=317
  getAreaDetailByCityId(areaId: Number, Id: number,areaTypeId:number): Observable<any> {
    const url = this.serverUrl + 'api/v1/getAreaDetails?access_token='+this.access_token+'&areaId='+areaId+'&mapCityId='+Id + '&areaTypeEnumId='+areaTypeId;
    return this.http.get<any>(url);
  }



  // Get Area by cityId or areaId getAreaDetails?areaId=0&cityId=317
  getAreaDetailBySearch(areaId: Number, Id: number, CountryName:string, StateName:string,CityName:string, dataFor:String): Observable<any> {
    const url = this.serverUrl + 'api/v1/getAreaDetails?areaId=' + areaId + '&mapCityId=' + Id + '&access_token=' + this.access_token+'&mapCountryName='+CountryName+'&mapStateName='+StateName+'&mapCityName='+CityName+'&dataFor='+dataFor//ForMapSearch -- Other' other;
    return this.http.get<any>(url);
  }

 // https://admin.evegah.com/api/uDIM?lat=22.70872188999673&long=75.85214680524903&dId=EMI2303


  setLatLngOrDevice(lat:Number, lng:Number, device:String): Observable<any> {
    const url = this.serverUrl + `uDIM?lat=${lat}&long=${lng}&dId=${device}`
    return this.http.get<any>(url);
  }
}

