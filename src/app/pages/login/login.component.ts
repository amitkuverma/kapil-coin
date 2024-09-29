import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';  // Import ToastrService
import { AuthService } from '../../services/auth.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private cookiesService: CookieService, private toastr: ToastrService) {  // Inject ToastrService
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]  // Agree to terms checkbox
    });
    this.cookiesService.deleteCookie('token')
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
  
      this.authService.login({ email, password }).subscribe(
        (response: any) => {
          if (response) {
            this.cookiesService.setCookie('token', response.token, 1);
  
            // Decode the token and handle null/undefined token cases
            const decodedToken = this.cookiesService.decodeToken();
            
            if (decodedToken && (decodedToken.status === 'live' || this.cookiesService.isAdmin())) {
              // User has completed their profile or is an admin, navigate to dashboard
              this.toastr.success('Login successful!', 'Success');
              this.router.navigate(['/dashboard']);
            } else if (decodedToken && decodedToken.status !== 'live') {
              // User profile is not complete, navigate to the payment page
              this.router.navigate(['/complete-payment']);
            } else {
              // Handle case where decodedToken is null/undefined
              this.toastr.error('Invalid token received. Please log in again.', 'Error');
              this.router.navigate(['/login']);  // Redirect back to login or take appropriate action
            }
          }
          this.isLoading = false;
        },
        (error: any) => {
          this.toastr.error('Login failed. Please check your credentials.', 'Error');
          console.error('Login failed', error);
          this.isLoading = false;
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
      this.toastr.warning('Please fill out the form correctly.', 'Warning');
    }
  }
  

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
