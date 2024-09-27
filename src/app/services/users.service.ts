import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    token!: any;
    headers!: any;

    constructor(private http: HttpClient, private cookiesService:CookieService) {
        this.token = this.cookiesService.getCookie("token")
    }

    getUsers(): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.get(`${environment.API_URL}/users`, { headers });
    }

    getUserById(userId:any): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.get(`${environment.API_URL}/users/${userId}`, { headers });
    }

    updateUserStatus(userId:any, status:any): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.put(`${environment.API_URL}/users/${userId}/status`, status, { headers });
    }

    getUserReferrals(userId:any): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.get(`${environment.API_URL}/referrals/${userId}`, { headers });
    }
}
