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
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<any[]>(`${environment.API_URL}/account`, { headers });
  }

  getAccountById(account: any): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<any[]>(`${environment.API_URL}/account/${account.userId}`, { headers });
  }

  saveAccount(account: any): Observable<any> {
    account.userId = this.userId;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    if (account.userId) {
      return this.http.put(`${environment.API_URL}/account/${account.userId}`, account, { headers });
    } else {
      return this.http.post(`${environment.API_URL}`, account);
    }
  }

  deleteAccount(accId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.delete(`${environment.API_URL}/account/${accId}`, { headers });
  }
}
