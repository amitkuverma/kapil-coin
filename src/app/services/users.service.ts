import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './cookie.service';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private apiUrl = 'https://api-18dg.onrender.com/api';
    token!: any;
    headers!: any;

    constructor(private http: HttpClient, private cookiesService:CookieService) {
        this.token = this.cookiesService.getCookie("token")
    }

    getUsers(): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.get(`${this.apiUrl}/users`, { headers });
    }

    getUserReferrals(userId:any): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.get(`${this.apiUrl}/referrals/${userId}`, { headers });
    }
}
