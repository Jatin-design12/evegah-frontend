import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IaddUpdateZone } from '../interfaces/zone/addZone';
@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  constructor(private http: HttpClient) { }
  serverEndPoint = environment.apiUrl;

  addUpdateZone(addUpdateZone: IaddUpdateZone): Observable<any> {
    const url = this.serverEndPoint + 'addUpdateZone?' + 'access_token=' + this.access_token;
    return this.http.post<IaddUpdateZone>(url, addUpdateZone)
  }

  getZoneList(zoneId: number, areaId: number): Observable<any> {
    const url =  this.serverEndPoint + 'getZone?zoneId=' + zoneId + '&statusEnumId=1&areaId=' + areaId + '&access_token=' + this.access_token;;
    // + this.access_token;
    return this.http.get<any>(url);
  }

  zoneDetails(): Observable<any> {
    const url = this.serverEndPoint + 'api/v1/getZoneList?' + 'access_token=' + this.access_token;;
    return this.http.get<any>(url);
  }

  getZoneDetail(zoneId: number, statusEnumId: number): Observable<any> {
    const url = this.serverEndPoint + 'getZone?zoneId=' + zoneId + '&statusEnumId=' + statusEnumId + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }

  // Zone master- Vehicle Stand
// localhost:9001/api/getMapState?mapCountryId=1
// localhost:9001/api/getMapCountry
// localhost:9001/api/getMapCity?mapStateId=10
// localhost:9001/api/api/v1/getMapAreaDetails?areaId=0&mapCityId=0&access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxIiwiaWF0IjoxNzAwNzE2MDM5LCJleHAiOjE3MDE1ODAwMzl9.tA-rfObblw1GH31fCgJR4e7zYYZyvLmvWizu3-sPmgw


getMapCity(Id: number): Observable<any> {
  const url = this.serverEndPoint + 'getMapCity?mapStateId='+ Id + '&access_token=' + this.access_token;
  return this.http.get<any>(url);
}

getMapState(Id: number): Observable<any> {
  const url = this.serverEndPoint + 'getMapState?mapCountryId='+ Id + '&access_token=' + this.access_token;
  return this.http.get<any>(url);
}
getMapCountry(): Observable<any> {
  const url = this.serverEndPoint + 'getMapCountry'+ '&access_token=' + this.access_token;
  return this.http.get<any>(url);
}
getAreaDetailOnMapZone(areaId:number,cityId:number, areaTypeId:number): Observable<any> {
  const url = this.serverEndPoint + 'api/v1/getMapAreaDetails?areaId='+ areaId +'&mapCityId='+cityId+ '&areaTypeEnumId='+areaTypeId+ '&access_token=' + this.access_token;
  return this.http.get<any>(url);
}
}



