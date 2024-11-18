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

    constructor(private http: HttpClient, private cookiesService: CookieService) {
        this.token = this.cookiesService.getCookie("token")
    }

    getUsers(): Observable<any> {
        return this.http.get(`${environment.API_URL}/users`);
    }

    getUserById(userId: any): Observable<any> {
        return this.http.get(`${environment.API_URL}/users/${userId}`);
    }

    updateUserStatus(userId: any, status: any): Observable<any> {
        const body = {
            status
        }
        return this.http.put(`${environment.API_URL}/users/${userId}/status`, body);
    }

    getParentReferrals(userId: any): Observable<any> {
        return this.http.get(`${environment.API_URL}/referral-parents/${userId}`);
    }

    getUserReferrals(userId: any): Observable<any> {
        return this.http.get(`${environment.API_URL}/referrals/${userId}`);
    }

    getUserParentReferrals(userId: any): Observable<any> {
        return this.http.get(`${environment.API_URL}/referral-parent/${userId}`);
    }

    getFrinfReferrals(): Observable<any> {
        return this.http.get(`${environment.API_URL}/referral-chain/${this.cookiesService.decodeToken().userId}`);
    }

    updateUserProfile(data: any): Observable<any> {
        return this.http.put(`${environment.API_URL}/users/update`, data);
    }

    updateUser(data: any, userId:any): Observable<any> {
        return this.http.put(`${environment.API_URL}/users/${userId}`, data);
    }

    // Change password
    forgetPassword(data: any): Observable<any> {
        return this.http.post(`${environment.API_URL}/forgot-password`, data);
    }
    
    changePassword(data: any): Observable<any> {
        return this.http.post(`${environment.API_URL}/reset-internal-password`, data);
    }

    deleteUser(userId: any): Observable<any> {
        return this.http.delete(`${environment.API_URL}/delete/${userId}`);
    }
}
