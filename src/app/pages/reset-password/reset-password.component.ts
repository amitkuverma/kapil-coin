import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  changePasswordForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  isChangePassword: boolean = false;
  token: any;
  userId: any;

  constructor(private fb: FormBuilder,
    private userService: UsersService,
    private cookies: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required]
    });
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;

      console.log(params['id']);
      if (params['id']) {
        this.isChangePassword = true;
        this.userId = params['id'];
      } else {
        this.userId = this.cookies.decodeToken().userId;
      }
    });
    console.log(this.userId);

  }



  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { newPassword, confirmPassword } = this.changePasswordForm.value;
      const data = {
        userId: this.userId, newPassword
      }
      if (newPassword === confirmPassword) {
        this.userService.changePassword(data).subscribe(
          (res) => {
            this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
            this.changePasswordForm.reset();
            this.router.navigate(['/login']); 
          },
          (error) => this.snackBar.open('Error changing password.', 'Close', { duration: 3000 })
        );
      } else {
        this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      }
    }
  }

  sendForgotPasswordLink() {
    if (this.forgotPasswordForm.valid) {
      this.userService.forgetPassword(this.forgotPasswordForm.value).subscribe(
        (res) => this.snackBar.open('Forgot password link sent on your email successfully!', 'Close', { duration: 3000 }),
        (error) => this.snackBar.open('Unable to send password link.', 'Close', { duration: 3000 })
      );
    }
  }
}
