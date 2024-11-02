import { Component } from '@angular/core';
import { CookieService } from '../services/cookie.service';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { CoinService } from '../services/coin.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidenavOpened = true; // Toggle state for sidebar
  customOptions: any = {
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    items: 1,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true
  };
  pymentResult: any;
  coinResult: any;

  constructor(private router: Router, public cookieService: CookieService, private paymentService: PaymentService, private coinService: CoinService) { }

  ngOnInit() {
    if (!this.cookieService.isAdmin()) {
      this.paymentService.getPaymentReferrals(this.cookieService.decodeToken().userId).subscribe(
        (res) => {
          this.pymentResult = res;

        },
        (error: any) => {
          console.log(error);
        }
      )
      this.coinService.getCoinById(1).subscribe(
        (res) => {
          this.coinResult = res;

        },
        (error: any) => {
          console.log(error);
        }
      )
    }

  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
  logout(): void {
    // Clear the token or any session data from cookies
    this.cookieService.deleteCookie('token');

    // Navigate back to the login page
    this.router.navigate(['/home']);
  }

  closeSidenav(sidenav: any): void {
    sidenav.close();
  }
}
