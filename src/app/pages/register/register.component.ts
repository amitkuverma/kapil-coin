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
    { code: '+971', name: 'UAE' },
    { code: '+61', name: 'Australia' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+39', name: 'Italy' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+86', name: 'China' },
    { code: '+55', name: 'Brazil' },
    { code: '+7', name: 'Russia' },
    { code: '+34', name: 'Spain' },
    { code: '+61', name: 'Australia' },
    { code: '+1-268', name: 'Antigua and Barbuda' },
    { code: '+1-264', name: 'Anguilla' },
    { code: '+1-242', name: 'Bahamas' },
    { code: '+1-246', name: 'Barbados' },
    { code: '+32', name: 'Belgium' },
    { code: '+359', name: 'Bulgaria' },
    { code: '+1-441', name: 'Bermuda' },
    { code: '+60', name: 'Malaysia' },
    { code: '+62', name: 'Indonesia' },
    { code: '+65', name: 'Singapore' },
    { code: '+64', name: 'New Zealand' },
    { code: '+63', name: 'Philippines' },
    { code: '+27', name: 'South Africa' },
    { code: '+234', name: 'Nigeria' },
    { code: '+254', name: 'Kenya' },
    { code: '+20', name: 'Egypt' },
    { code: '+52', name: 'Mexico' },
    { code: '+60', name: 'Malaysia' },
    { code: '+66', name: 'Thailand' },
    { code: '+84', name: 'Vietnam' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+92', name: 'Pakistan' },
    { code: '+880', name: 'Bangladesh' }
    // You can add more countries as per your requirements
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
