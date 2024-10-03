import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  editProfileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  user!: any; // User information

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private snackBar: MatSnackBar,
    private cookies: CookieService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
  }

  // Initialize the forms
  initForms() {
    // Edit profile form
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      password: [''],
      image: [''],
      referralCode: [''],
      status: ['active', Validators.required]
    });

    // Change password form
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  // Load user profile from backend
  loadUserProfile() {
    const userId = this.cookies.decodeToken().userId;
    this.userService.getUserById(userId).subscribe((user) => {
      this.user = user;
      this.editProfileForm.patchValue(user); // Populate form with user data
    });
  }

  // Submit profile changes
  onSubmitEditProfile() {
    if (this.editProfileForm.valid) {
      // this.userService.updateUserProfile(this.editProfileForm.value).subscribe(
      //   () => this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 }),
      //   (error) => this.snackBar.open('Error updating profile.', 'Close', { duration: 3000 })
      // );
    }
  }

  // Change password logic
  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;
      if (newPassword === confirmPassword) {
        // this.userService.changePassword({ oldPassword, newPassword }).subscribe(
        //   () => this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 }),
        //   (error) => this.snackBar.open('Error changing password.', 'Close', { duration: 3000 })
        // );
      } else {
        this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      }
    }
  }

  // Print ID logic
  printId() {
    const printContents = document.querySelector('.id-card')?.innerHTML;
    const originalContents = document.body.innerHTML;
  
    document.body.innerHTML = printContents || '';
  
    window.print();
  
    document.body.innerHTML = originalContents; // Restore original content
    window.location.reload(); // Reload the page to restore event listeners
  }
}
