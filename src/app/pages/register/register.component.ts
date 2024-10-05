import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationSuccess: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cookiesService: CookieService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],
        confirmPassword: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        referralCode: [''],
        agreeToTerms: [false, [Validators.requiredTrue]] // Terms and Conditions checkbox
      },
      { validator: this.checkPasswords }
    );

    this.route.queryParamMap.subscribe((params) => {
      const referralCode = params.get('referralCode');

      if (referralCode) {
        this.registerForm.get('referralCode')?.setValue(referralCode);
        this.registerForm.get('referralCode')?.disable();
      }
    });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.registerForm.get('referralCode')?.enable();

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.authService.login({ email: response.email, password: this.registerForm.get('password')?.value }).subscribe(
            (response: any) => {
              if (response) {
                this.cookiesService.setCookie('token', response.token, 1);
                this.router.navigate(['/complete-payment']);
              }
            }
          )
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Registration failed', error);
        }
      );
    }
  }

  login() {
    this.router.navigate(['/login']);
  }
}
