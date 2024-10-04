import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';
import { CookieService } from 'src/app/services/cookie.service';
import { UploadService } from 'src/app/services/uploadfile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  editProfileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  user!: any; // User information
  imagePreviewUrl: any;
  selectedImage: any;
  imageUrl:any;
  isImageUploaded:boolean = false;


  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private snackBar: MatSnackBar,
    private cookies: CookieService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
    this.imageUrl = environment.IMAGE_URL
  }

  // Initialize the forms
  initForms() {
    // Edit profile form
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      password: [''],
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

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);

      // Update form control for image
      this.editProfileForm.patchValue({ image: this.selectedImage });
      this.editProfileForm.get('image')?.updateValueAndValidity();
    }
  }

  // Handle the upload action
  upload(): void {
    if (this.selectedImage) {
      this.uploadService.uploadFile(this.selectedImage, this.cookies.decodeToken().userId, 'user')
        .subscribe(
          response => {
            console.log('File uploaded successfully', response);
            this.isImageUploaded = true; // Mark image as uploaded
          },
          error => {
            console.error('Error uploading file', error);
          }
        );
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
