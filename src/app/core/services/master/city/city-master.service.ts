import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityMasterService {
  access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  serverUrl: string = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.apiUrl;
  }

  // For ADD UPDate Master
  addUpdateCity(areaModel: any): Observable<any> {
    const url = this.serverUrl + 'addUpdateMapCity?access_token=' + this.access_token;
    return this.http.post<any>(url, areaModel);
  }

  getCityMaterList(){
    const url = this.serverUrl + 'getCityDataForTable'+'?access_token=' + this.access_token;
    return this.http.get<any>(url);
  }
  
  getCityMapDetailById(id:Number){
    const url = this.serverUrl + 'getMapCityDetail?mapCityId='+id+'&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }

  getCityDetailBySearch( CountryName:string, StateName:string,CityName:string, dataFor:String): Observable<any> {
    const url = this.serverUrl + 'getMapCityDetailsForSearche' + '?access_token=' + this.access_token+'&mapCountryName='+CountryName+'&mapStateName='+StateName+'&mapCityName='+CityName+'&dataFor='+dataFor//ForMapSearch -- Other' other;
    return this.http.get<any>(url);
  }
  


}
