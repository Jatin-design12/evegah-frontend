import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ILogin } from '../interfaces/session/login';
import { IResetPassword } from '../interfaces/session/resetPassword';
import { INewResetPassword } from "../interfaces/session/newResetPassword";
import { IChangePassword } from '../interfaces/session/change-password';
import { ICommonResponse } from '../interfaces/common/common-response';


@Injectable({
  providedIn: 'root'
})
export class SessionService {
 
  
  constructor(private http: HttpClient) { }
  serverEndPoint = environment.apiUrl;

  adminlogin(login: ILogin): Observable<any> {
    return this.http.post<ILogin>(this.serverEndPoint + 'adminLogin', login)
  }
 
  resetPassword(resetPassword: IResetPassword): Observable<any> {
    return this.http.post<IResetPassword>(this.serverEndPoint + 'ResetpasswordEMailGeneration', resetPassword)
  }

  newResetPassword(newResetPassword: INewResetPassword):Observable<any>{
    let access_token =JSON.parse(sessionStorage.getItem('user')).access_token 
    newResetPassword.token = access_token
    let url = this.serverEndPoint + 'updateAdminPasswordByEmail?access_token='+ access_token
    return this.http.post<INewResetPassword>(url,newResetPassword )

  }

  changePassword(changePassword: IChangePassword):Observable<ICommonResponse>{
    return this.http.post<ICommonResponse>(this.serverEndPoint + 'updateAdminPassword', changePassword )

  }
  adminlogOut(): Observable<any> {
    let access_token =JSON.parse(sessionStorage.getItem('user')).access_token
    let url = this.serverEndPoint + 'logOutAdmin?'+'access_token='+ access_token
    return this.http.post<ILogin>(url,{id:JSON.parse(sessionStorage.getItem('user')).id})
  }



}
