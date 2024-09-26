import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookiesService: CookieService
  ) {}

  canActivate(): boolean {
    const token = this.cookiesService.getCookie('token');
    
    // Check if token exists
    if (!token) {
      this.router.navigate(['/home']);
      return false;
    }

    const decodedToken = this.cookiesService.decodeToken();

    // Check if the user is admin and the profile status is 'completed'
    if (decodedToken && (decodedToken.status === 'completed' || this.cookiesService.isAdmin())) {
      return true;  // Allow access
    } else {
      // Redirect to login page if not authorized
      this.router.navigate(['/login']);
      return false;
    }
  }
}
