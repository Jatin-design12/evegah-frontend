import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IGetBookingData } from '../interfaces/booking-data/list';
@Injectable({
  providedIn: 'root'
})
export class BookingDataService {
  access_token =  JSON.parse(sessionStorage.getItem('user')).access_token
  constructor(private http: HttpClient) { }
  serverEndPoint = environment.apiUrl;



  getBookingDataList(bookingId: number, statusEnumId: number): Observable<IGetBookingData> {
    const url = this.serverEndPoint + `/api/v1/getRideBookingDetails?rideBookingId=${bookingId}&statusEnumId=${statusEnumId}`+'&access_token='+ this.access_token
    return this.http.get<IGetBookingData>(url);
  }
}

