import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {
  userId: any;
  token: any;

  constructor(private http: HttpClient, private cookiesService: CookieService) {
    this.userId = this.cookiesService.decodeToken().userId;
    this.token = this.cookiesService.getCookie("token")
  }

  getAllAccounts(): Observable<any[]> {
    
    return this.http.get<any[]>(`${environment.API_URL}/account`);
  }

  getAdminAccount(): Observable<any[]> {
    
    return this.http.get<any[]>(`${environment.API_URL}/account/1`);
  }

  getAccountById(): Observable<any[]> {
    
    return this.http.get<any[]>(`${environment.API_URL}/account/${this.cookiesService.decodeToken().userId}`);
  }

  saveAccount(account: any, accId:number): Observable<any> {
    account.userId = this.userId;
    
    if (accId != null) {
      return this.http.put(`${environment.API_URL}/account/${accId}`, account);
    } else {
      return this.http.post(`${environment.API_URL}/account`, account);
    }
  }

  deleteAccount(accId: number): Observable<any> {
    
    return this.http.delete(`${environment.API_URL}/account/${accId}`);
  }
}
