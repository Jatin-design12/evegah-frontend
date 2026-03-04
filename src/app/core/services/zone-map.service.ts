import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZoneMapService {
  access_token = JSON.parse(sessionStorage.getItem('user')).access_token

  constructor(private http: HttpClient) { }
  serverEndPoint = environment.apiUrl;

  zoneDetails(): Observable<any> {
    this.access_token = JSON.parse(localStorage.getItem('USER_DETAILS')).access_token || localStorage.getItem('access_token');
    const url = this.serverEndPoint + 'api/v1/getZoneList' + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }

  getZoneDetail(zoneId: number, statusEnumId: number): Observable<any> {
    this.access_token = JSON.parse(localStorage.getItem('USER_DETAILS')).access_token || localStorage.getItem('access_token');
    const url = this.serverEndPoint + 'getZone?zoneId=' + zoneId + '&statusEnumId=' + statusEnumId + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }

  getZoneList(zoneId: number, areaId: number): Observable<any> {
    this.access_token = JSON.parse(localStorage.getItem('USER_DETAILS')).access_token || localStorage.getItem('access_token');
    const url = this.serverEndPoint + 'getZone?zoneId=' + zoneId + '&statusEnumId=1&areaId=' + areaId + '&access_token=' + this.access_token;
    // + this.access_token;
    return this.http.get<any>(url);
  }

  // /api/api/v1/getzoneDetailWithBikeCountList?zoneId=0&mapCityId=0&mapCountryName=India&mapStateName=Madhya Pradesh&mapCityName=Indore&dataFor=ForMapSearch
  // Get Area by cityId or areaId getAreaDetails?areaId=0&cityId=317
  getzoneDetailBySearch(zoneId: Number, Id: number, CountryName:string, StateName:string,CityName:string, dataFor:String): Observable<any> {
    const url = this.serverEndPoint+ 'api/v1/getzoneDetailWithBikeCountList?zoneId=' + zoneId + '&mapCityId=' + Id + '&access_token=' + this.access_token+'&mapCountryName='+CountryName+'&mapStateName='+StateName+'&mapCityName='+CityName+'&dataFor='+dataFor//ForMapSearch -- Other' other;
    return this.http.get<any>(url);
  }

  getzoneDetailBySearchWithTotalCountForAllBike(zoneId: Number, Id: number, bikeId:number, CountryName:string, StateName:string,CityName:string, dataFor:String): Observable<any> {
    const url = this.serverEndPoint+ 'getzoneDetailWithAllTypeBikeCountList?zoneId=' + zoneId + '&mapCityId=' + Id + '&bikeId='+bikeId+ '&access_token=' + this.access_token+'&mapCountryName='+CountryName+'&mapStateName='+StateName+'&mapCityName='+CityName+'&dataFor='+dataFor//ForMapSearch -- Other' other;
    return this.http.get<any>(url);
  }
  
}
