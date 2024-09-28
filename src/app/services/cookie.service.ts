import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor() {
  }

  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }
  
  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }
  
  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  decodeToken(): any {
    try {
      const token:any = this.getCookie('token');
      return jwt_decode(token);  // Use .default when using namespace import
    } catch (error) {
      console.error('Token decoding failed', error);
      return null;
    }
  }

  isAdmin(){
    if(this.decodeToken().isAdmin){
      return true;
    }
    return false;
  }
  
   // Get expiration time from token
   getTokenExpiration(): number | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.exp : null;
  }

  // Method to check if token is expired
  isTokenExpired(): boolean {
    const exp = this.getTokenExpiration();
    if (!exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return exp < currentTime;
  }

}
