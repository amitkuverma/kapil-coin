import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private cookiesService: CookieService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      // agreeToTerms: [true, [Validators.requiredTrue]]  // Agree to terms checkbox
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.cookiesService.setCookie('token', response.token, 1);
            
            if(this.cookiesService.decodeToken().status == "completed"){
              this.router.navigate(['/dashboard']);
            }else{
              this.router.navigate(['/complete-payment']);
            }
          }
        },
        (error: any) => {
          console.error('Login failed', error);
        }
      );
    }
  }

  // Navigation to registration page
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Navigation to forgot password page
  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
