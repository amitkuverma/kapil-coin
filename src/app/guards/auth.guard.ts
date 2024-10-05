import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from '../services/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookiesService: CookieService
  ) {}

  canActivate(): boolean {
    const token:any = this.cookiesService.getCookie('token');

    // If no token, redirect to login page
    if (!token || this.cookiesService.isTokenExpired()) {
      this.router.navigate(['/home']);
      return false;
    }

    const decodedToken = this.cookiesService.decodeToken();

    // Check if the user is admin or has an live status
    if (decodedToken && (decodedToken.status === 'active' || this.cookiesService.isAdmin())) {
      return true;  // Allow access
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
