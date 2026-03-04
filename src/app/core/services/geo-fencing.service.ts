import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeoFencingService {
   access_token = JSON.parse(sessionStorage.getItem('user')).access_token
  constructor(private http: HttpClient) {
 
   }
  serverEndPoint = environment.apiUrl;

  findPointOnCircle(obj: any): Observable<any> {
    const url = this.serverEndPoint + 'FindPointInCircle' //+ '&access_token=' + this.access_token;
    return this.http.post<any>(url, obj)
  }

  findPointOnRect(obj: any): Observable<any> {
    const url = this.serverEndPoint + 'FindPointInRectangle' //+ '&access_token=' + this.access_token;
    return this.http.post<any>(url, obj)
  }

  findPointOnPolygon(obj: any): Observable<any> {
    const url = this.serverEndPoint + 'FindPointInPolygon'// + '&access_token=' + this.access_token;
    return this.http.post<any>(url, obj)
  }

  findPointNearestPoint(obj: any): Observable<any> {
    const url = this.serverEndPoint + 'FindPointNearestPoint' //+ '&access_token=' + this.access_token;
    return this.http.post<any>(url, obj)
  }
  FindPointNearestPointDistance(obj: any): Observable<any> {
    const url = this.serverEndPoint + 'FindPointNearestPointDistance' //+ '&access_token=' + this.access_token;
    return this.http.post<any>(url, obj)
  }
}
