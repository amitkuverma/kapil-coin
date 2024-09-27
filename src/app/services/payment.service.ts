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
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.post(`${environment.API_URL}/payments`, paymentData, { headers });
        
    }

    getAllReferUser(): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.get(`${environment.API_URL}/payments`, { headers });
    }

    getUserReferrals(): Observable<any> {       
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`); 
        return this.http.get(`${environment.API_URL}/payments/${this.cookiesService.decodeToken().userId}`, { headers });
    }

    uploadReceipt(receiptData: FormData): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.post(`${environment.API_URL}/payments/upload-receipt/${this.cookiesService.decodeToken().userId}`, receiptData, { headers });
    }
}
