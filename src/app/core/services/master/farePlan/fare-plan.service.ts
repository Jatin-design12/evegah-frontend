import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFarePlanData } from 'src/app/core/interfaces/master/fareplan/fare-plan-data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FarePlanService {
  access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }

  // For ADD UPDate Master //areaModel
  addUpdateFarePlan(data: any): Observable<any> {
    const url = this.serverUrl + 'api/v1/addUpdateFarePlan?access_token=' + this.access_token;
    return this.http.post<IFarePlanData>(url, data);
  }

  // Get Plan List
  getAlllistFarePlan(planId: Number, cityId: Number, modelId: Number, areaId, statusId): Observable<any> {
    const url = this.serverUrl + 'api/v1/getFarePlanDetail?farePlanId=' + planId + '&mapCityId=' + cityId + '&modelId=' + modelId + '&areaId=' + areaId + '&statusEnumId=' + statusId + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }



  // GEt fare Plan list Data state and city Wise
  getFareList(): Observable<any> {
    const url = this.serverUrl + 'api/v1/getFarePlanCityState?access_token=' + this.access_token;//'api/v1/getAreaCityState';
    return this.http.get<any>(url);
  }

  // Get Vehicle Type list
  getvehicleTypeList(): Observable<any> {
    const url = this.serverUrl + 'api/v1/getVehicleTypeList?access_token=' + this.access_token;
    return this.http.get<any>(url);
  }
  

getFarePlanAllList(): Observable<any> {
  const url = this.serverUrl + 'getAreaMapCityState?access_token=' + this.access_token;
  return this.http.get<any>(url);
}

}
