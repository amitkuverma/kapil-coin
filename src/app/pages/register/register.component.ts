import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '../../services/cookie.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationSuccess: boolean = false;
  isLoading: boolean = false;
  hidePassword: boolean = true; // Control visibility of password
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;

  countryCodes = [
    { code: '+1', name: 'USA' },
    { code: '+91', name: 'India' },
    { code: '+44', name: 'UK' },
    { code: '+971', name: 'UAE' }
    // Add more country codes as needed
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cookiesService: CookieService,
    public dialog: MatDialog,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required],
        countryCode: ['+1', Validators.required], // Default country code
        mobile: ['', [Validators.required, Validators.pattern(/^\d{6,15}$/)]], // Mobile number without country code
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
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formValue = this.registerForm.value;
      const mobileWithCountryCode = formValue.countryCode + formValue.mobile; // Combine country code with mobile

      // Modify form data to include the full mobile number
      const registrationData = {
        ...formValue,
        mobile: mobileWithCountryCode
      };

      this.authService.register(registrationData).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.authService.login({ email: response.email, password: this.registerForm.get('password')?.value }).subscribe(
            (response: any) => {
              if (response) {
                this.cookiesService.setCookie('token', response.token, 1);
                this.router.navigate(['/complete-payment']);
              }
            }
          );
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Registration failed', error);
        }
      );
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login() {
    this.router.navigate(['/login']);
  }

  openShareDialog() {
    this.dialog.open(this.shareDialog);
  }
}
