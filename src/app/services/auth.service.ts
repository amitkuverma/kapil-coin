import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${environment.API_URL}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.API_URL}/register/${data.referralCode}`, data);
  }

  resendOTP(email: string) {
    return this.http.post(`${environment.API_URL}/resend-otp`, { email });
  }

  resetPassword(email: string, otp: any, newPassword: any) {
    return this.http.post(`${environment.API_URL}/reset-password`, { email, otp, newPassword });
  }

  forgotPassword(email: string) {
    return this.http.post(`${environment.API_URL}/forgot-password`, { email });
  }

  verifyOTP(email: string, otp:any) {
    return this.http.post(`${environment.API_URL}/verify-otp`, { email, otp });
  }
}
