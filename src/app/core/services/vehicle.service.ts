
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
//import { IMobileNumber } from '../interfaces/session/mobileNumber';
import { IVehicleModelDetails } from '../interfaces/vehicle/addvehicle';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehicleModelService {
  serverUrl: string = '';
  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
 
  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }


  VehicleModelDetails(VehicleModelDetails: IVehicleModelDetails): Observable<any> {
    const url = this.serverUrl + 'api/v1/addUpdateVehicleModelDetails?'+'access_token='+ this.access_token;
    return this.http.post<IVehicleModelDetails>(url, VehicleModelDetails);
  }

  getVehicleModelDetails(VehicleId:number,statusEnumId): Observable<any> {
    const url = this.serverUrl + 'api/v1/getVehicleModel?VehicleId='+VehicleId+"&statusEnumId="+statusEnumId +'&access_token='+ this.access_token;
    return this.http.get<IVehicleModelDetails>(url);
  }
  
  getVehicleList():Observable<any>{
    const url = this.serverUrl + 'api/v1/getVehicleList?'+'access_token='+ this.access_token;
    return this.http.get<IVehicleModelDetails>(url);
  }


  vehicleModelInsert(VehicleModelDetails: IVehicleModelDetails, ): Observable<any> {
    const url = this.serverUrl + `insertVehicleModelDetail?frontendOptionName=${VehicleModelDetails.option}&frontendPageName=${VehicleModelDetails.pageName}&apiRequestFromEnumId=${VehicleModelDetails.req}&frontendActionName=${VehicleModelDetails.add}&access_token=${this.access_token}`;
    return this.http.post<IVehicleModelDetails>(url, VehicleModelDetails);
  }

  getVehicleModelListDetails(obj:any): Observable<any> {
    const url = this.serverUrl + `getVehicleModelDetails?vehicleId=${obj.vehicleId}&statusEnumId=1&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`//'api/v1/getVehicleModel?VehicleId='+VehicleId+"&statusEnumId="+statusEnumId +'&access_token='+ this.access_token;
    return this.http.get<IVehicleModelDetails>(url);
  }

  
  getVehicleModelListDetailsForTable(obj:any): Observable<any> {
    const url = this.serverUrl + `getVehicleModelDetailsForTable?vehicleId=${obj.vehicleId}&statusEnumI&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`//'api/v1/getVehicleModel?VehicleId='+VehicleId+"&statusEnumId="+statusEnumId +'&access_token='+ this.access_token;
    return this.http.get<IVehicleModelDetails>(url);
  }
  
}
