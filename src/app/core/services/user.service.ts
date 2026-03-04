import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IRideRating } from '../interfaces/user/ride-rating';
import { ModelRideRating } from '../models/user/ride-rating-Model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  access_token = JSON.parse(sessionStorage.getItem('user')).access_token

  constructor(private http: HttpClient) { }
  serverEndPoint = environment.apiUrl;

  getUserList(userId: number, statusEnumId: number): Observable<any> {
    const source = interval(1000);
    const url = this.serverEndPoint + 'getUser?id=' + userId + '&statusEnumId=' + statusEnumId + '&access_token=' + this.access_token;
    return this.http.get<any>(url);
  }

  getUserListWithDelta(userId: number, statusEnumId: number, updatedSince?: string): Observable<HttpResponse<any>> {
    let url = this.serverEndPoint + 'getUser?id=' + userId + '&statusEnumId=' + statusEnumId + '&access_token=' + this.access_token;
    if (updatedSince) {
      url += '&updatedSince=' + encodeURIComponent(updatedSince);
    }
    return this.http.get<any>(url, { observe: 'response' });
  }

  // service  to add riding balance in user accounts
  rechargeWallet(params: any): Observable<any> {
    const url = this.serverEndPoint + 'api/v1/aadUserRechargeAmountByAdmin?access_token=' + this.access_token;
    return this.http.post<any>(url, params);
  }

  // service  to add security deposit balance in user accounts
  addSecurityDeposit(params: any): Observable<any> {
    const url = this.serverEndPoint + 'api/v1/addDepositAmountToUserWalletByAdmin?access_token=' + this.access_token;
    return this.http.post<any>(url, params);
  }

  getDashboardCard(): Observable<any> {
    const url = this.serverEndPoint + 'api/v1/getDashboardCard?' + 'access_token=' + this.access_token;
    return this.http.get<any>(url);
  }



  // user ride  Rating 
  getRideRatingSearchButton(obj: any): Observable<any> {
    const url = this.serverEndPoint + `getRideBookingDetailForCommentsReply?frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.post<any>(url, obj);
  }

  addRidebookingCommentsReply(obj: any): Observable<any> {
    const url = this.serverEndPoint + `addRidebookingCommentsReply?&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.post<any>(url, obj);
  }

  // get Section List
  getSectionList(obj: any): Observable<any> {
    const url = this.serverEndPoint + `getSectionList?sectionId=${obj.id}&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.get<any>(url, obj);
  }

  getFaqTableList(obj: any): Observable<any> {
    const url = this.serverEndPoint + `getAllSectionFAQDetail?sectionId=${obj.sectionId}&questionId=${obj.questionId}&faqPublishStatusEnumId=${obj.faqPublishStatusEnumId}&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.get<any>(url, obj);
  }

  // 
  AddFAq(obj: any): Observable<any> {
    const url = this.serverEndPoint + `AddSectionAndFAQDetail?&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.post<any>(url, obj);
  }

  publishFaq(obj: any): Observable<any> {
    const url = this.serverEndPoint + `publishFAQDetail?&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.post<any>(url, obj);
  }

  UnpublishFaq(obj: any): Observable<any> {
    const url = this.serverEndPoint + `unPublishFAQDetail?&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.post<any>(url, obj);
  }


  addFAQSequence(obj: any): Observable<any> {
    const url = this.serverEndPoint + `addFAQSequence?&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.post<any>(url, obj);
  }
  addSectionSequense(obj: any): Observable<any> {
    const url = this.serverEndPoint + `addSectionSequense?&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.post<any>(url, obj);
  }
  addEditSectionName(obj: any): Observable<any> {
    const url = this.serverEndPoint + `addEditSectionName?&frontendOptionName=${obj.option}&frontendPageName=${obj.pageName}&apiRequestFromEnumId=${obj.req}&frontendActionName=${obj.add}&access_token=${this.access_token}`;
    return this.http.post<any>(url, obj);
  }


}
