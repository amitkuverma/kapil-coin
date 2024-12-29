import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie.service';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent {
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  changePasswordForm: FormGroup;
  step: number = 1; // 1: Request OTP, 2: Verify OTP, 3: Change Password
  email: string = ''; // To store the email entered during the process

  constructor(private fb: FormBuilder, private forgotPasswordService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  sendForgotPasswordLink() {
    if (this.forgotPasswordForm.valid) {
      this.email = this.forgotPasswordForm.value.email;
      this.forgotPasswordService.forgotPassword(this.email).subscribe({
        next: () => {
          console.log('OTP sent successfully');
          this.step = 2; // Proceed to OTP verification
        },
        error: (err) => {
          console.error('Error sending OTP:', err);
        },
      });
    }
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      const otp = this.otpForm.value.otp;
      this.forgotPasswordService.verifyOTP(this.email, otp).subscribe({
        next: () => {
          console.log('OTP verified successfully');
          this.step = 3; // Proceed to password reset
        },
        error: (err) => {
          console.error('Error verifying OTP:', err);
        },
      });
    }
  }

  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { newPassword, confirmPassword } = this.changePasswordForm.value;
      if (newPassword === confirmPassword) {
        this.forgotPasswordService.resetPassword(this.email, this.otpForm.value.otp, newPassword).subscribe({
          next: () => {
            console.log('Password changed successfully');
            alert('Password reset successfully!');
            this.step = 1; // Reset the flow
          },
          error: (err) => {
            console.error('Error resetting password:', err);
          },
        });
      } else {
        alert('Passwords do not match!');
      }
    }
  }

  resendOtp() {
    this.forgotPasswordService.resendOTP(this.email).subscribe({
      next: () => {
        console.log('OTP resent successfully');
      },
      error: (err) => {
        console.error('Error resending OTP:', err);
      },
    });
  }
}
