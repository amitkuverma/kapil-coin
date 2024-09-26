import { Component } from '@angular/core';
import { CookieService } from '../services/cookie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(private router: Router, public cookieService: CookieService) {}

  logout(): void {
    // Clear the token or any session data from cookies
    this.cookieService.deleteCookie('token'); 

    // Navigate back to the login page
    this.router.navigate(['/login']);
  }
}
