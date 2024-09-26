import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from './cookie.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = 'https://api-18dg.onrender.com/api';
    token!: any;
    headers!: any;

    constructor(private http: HttpClient, private cookiesService: CookieService) {
        this.token = this.cookiesService.getCookie("token")
    }

    createPayment(paymentData: any): Observable<any> {
        paymentData.userId = this.cookiesService.decodeToken().userId || 1;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.post(`${this.apiUrl}/payments`, paymentData, { headers });
    }

    getUserReferrals(userId:any): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.get(`${this.apiUrl}/payments/${userId}`, { headers });
    }

    uploadReceipt(receiptData: FormData): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.post(`${this.apiUrl}/upload-receipt`, receiptData, { headers });
    }
}
