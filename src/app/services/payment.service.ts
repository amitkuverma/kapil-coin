import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './cookie.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    token!: any;
    headers!: any;

    constructor(private http: HttpClient, private cookiesService: CookieService) {
        this.token = this.cookiesService.getCookie("token")
    }

    createPayment(paymentData: any): Observable<any> {
        paymentData.userId = this.cookiesService.decodeToken().userId;        
        paymentData.userName = this.cookiesService.decodeToken().userName;
        return this.http.post(`${environment.API_URL}/payment`, paymentData);
        
    }

    getAllReferUser(): Observable<any> {                
        return this.http.get(`${environment.API_URL}/payments`);
    }

    getUserReferrals(userId:any): Observable<any> {                
        return this.http.get(`${environment.API_URL}/payment/${userId}`);
    }
    
    updateUserStatus(body:any, payId:any): Observable<any> {                
        return this.http.put(`${environment.API_URL}/payment/${payId}`, body);
    }

    uploadReceipt(receiptData: FormData): Observable<any> {        
        return this.http.post(`${environment.API_URL}/payment/${this.cookiesService.decodeToken().userId}/upload-receipt`, receiptData);
    }
}
