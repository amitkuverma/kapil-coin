import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '../../services/cookie.service';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';

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
  @ViewChild('emailVerificationDialog') emailVerificationDialog!: TemplateRef<any>;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>; // Terms and Conditions Dialog Reference

  emailOtp: any;
  regUser: any;
  userInfo: any;
  isResendingOTP: boolean = false;
  resendOTPSuccess: boolean = false;
  resendOTPError: boolean = false;
  isOptSend: boolean = false;

  countryCodes = [
    { code: '+1', name: 'USA' },
    { code: '+91', name: 'India' },
    { code: '+977', name: 'Nepal' },
    { code: '+44', name: 'UK' },
    { code: '+975', name: 'Bhutan' },
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
    { code: '+880', name: 'Bangladesh' },
    { code: '+852', name: 'Hongkong' }
    // You can add more countries as per your requirements
  ];


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cookiesService: CookieService,
    public dialog: MatDialog,
    private userService: UsersService,
    private toastr: ToastrService
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
    this.fatchUser();
    this.route.queryParamMap.subscribe((params) => {
      const referralCode = params.get('referralCode');
      if (referralCode) {
        this.registerForm.get('referralCode')?.setValue(referralCode);
        this.registerForm.get('referralCode')?.disable();
      }
    });
  }

  fatchUser() {
    this.userService.getUserById(this.cookiesService.decodeToken()?.userId).subscribe(
      res => {
        this.regUser = res
        if (!res.emailVerified) {
          this.isOptSend = true;
        }
      }
    )
  }

  get passwordError() {
    const control = this.registerForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    } else if (control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    } else if (control?.hasError('pattern')) {
      return 'Password must include at least one uppercase letter, one number, and one special character';
    }
    return '';
  }

  openTermsDialog() {
    this.dialog.open(this.shareDialog, {
      disableClose: false // Allow closing on backdrop click
    });
  }

  // Existing OTP dialog method
  openShareDialog() {
    this.dialog.open(this.emailVerificationDialog, {
      disableClose: true // Prevent dialog from closing on backdrop click
    });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Getter for showing error in the template
  get passwordMismatchError() {
    return this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.touched;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerForm.get('referralCode')?.enable();
      const formValue = this.registerForm.value;
      const mobileWithCountryCode = formValue.countryCode + formValue.mobile; // Combine country code with mobile

      // Prepare registration data
      const registrationData = {
        ...formValue,
        mobile: mobileWithCountryCode,
        emailVerified: false // Set email verification status initially to false
      };

      // Call the registration service to create the user
      this.authService.register(registrationData).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.regUser = response; // Store the response to use for OTP verification

          // Open the OTP dialog
          // this.openShareDialog();
          this.isOptSend = true
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Registration failed', error);
        }
      );
    }
  }

  verifyOtpUser() {


    // Now save the user data only if OTP is verified
    this.userService.updateUser(this.regUser, this.regUser.userId).subscribe(
      res => {
        this.authService.login({ email: this.regUser.email, password: this.registerForm.get('password')?.value }).subscribe(
          (response: any) => {
            if (response) {
              this.cookiesService.setCookie('token', response.token, 1);
              this.toastr.success("OTP Verified");
              this.router.navigate(['/complete-payment']);
              this.dialog.closeAll();
            }
          }
        );
      },
      error => {
        this.toastr.error("Unable to verify the OTP.");
      }
    );

  }

  resendOTP() {
    this.isResendingOTP = true;
    this.resendOTPSuccess = false;
    this.resendOTPError = false;

    // Call the AuthService to resend OTP
    this.authService.resendOTP(this.regUser.email).subscribe(
      (response: any) => {
        this.isResendingOTP = false;
        this.resendOTPSuccess = true;
        this.toastr.success('OTP has been resent to your email.');
      },
      (error: any) => {
        this.isResendingOTP = false;
        this.resendOTPError = true;
        this.toastr.error('Failed to resend OTP. Please try again.');
        console.error('Resend OTP failed:', error);
      }
    );
  }

  // verifyOtpUser() {
  //   this.authService.verifyOTP(this.regUser.email, this.emailOtp).subscribe(
  //     (response: any) => {
  //       // this.authService.login({ email: this.regUser.email, password: this.registerForm.get('password')?.value }).subscribe(
  //       //   (response: any) => {
  //       //     if (response) {
  //       //       this.cookiesService.setCookie('token', response.token, 1);

  //       //     }
  //       //   }
  //       // );
  //       this.toastr.success(response.message);
  //       this.router.navigate(['/complete-payment']);
  //     },
  //     (error: any) => {
  //       this.toastr.error(error.error.message);
  //       console.error('Resend OTP failed:', error);
  //     }
  //   );
  // }


  closeModel() {
    this.userService.deleteUser(this.regUser?.userId ? this.regUser?.userId : this.userInfo?.userId).subscribe(
      res => {
        console.log(res);
        this.dialog.closeAll();
      },
      error => {
        console.log(error);
        this.dialog.closeAll();
      }
    )
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login() {
    this.router.navigate(['/login']);
  }

  // openShareDialog() {
  //   this.dialog.open(this.emailVerificationDialog, {
  //     disableClose: true // Prevent dialog from closing on backdrop click
  //   });
  // }
}
