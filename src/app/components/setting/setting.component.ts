import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';
import { CookieService } from 'src/app/services/cookie.service';
import { UploadService } from 'src/app/services/uploadfile.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  docPreviewUrl: any;
  selectedImage: any;
  selectedDoc: any;
  imageUrl:any;
  isImageUploaded:boolean = false;
  isDocUploaded:boolean = false;


  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private snackBar: MatSnackBar,
    private cookies: CookieService,
    private router: Router,
    private uploadService: UploadService,
    private toastr: ToastrService
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
      this.userService.updateUser(this.editProfileForm.value, this.cookies.decodeToken().userId).subscribe(
        (res) => this.toastr.success('Profile updated successfully!'),
        (error) => this.toastr.error('Error updating profile.')
      );
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
  onDocFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedDoc = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.docPreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedDoc);

      // Update form control for image
      this.editProfileForm.patchValue({ document: this.selectedDoc });
      this.editProfileForm.get('document')?.updateValueAndValidity();
    }
  }

  // Handle the upload action
  upload(type:any): void {
    if (this.selectedImage) {
      this.uploadService.uploadFile(this.selectedImage, this.cookies.decodeToken().userId, type)
        .subscribe(
          response => {
            this.toastr.success('File uploaded successfully', 'Success');
            this.isDocUploaded = true; // Mark image as uploaded
          },
          error => {
            this.toastr.error('Error uploading file', 'Error');
          }
        );
    }else{
      this.uploadService.uploadFile(this.selectedDoc, this.cookies.decodeToken().userId, type)
        .subscribe(
          response => {
            this.toastr.success('File uploaded successfully', 'Success');
            this.isDocUploaded = true; // Mark image as uploaded
          },
          error => {
            this.toastr.error('Error uploading file', 'Error');
          }
        );
    }
  }

  // Change password logic
  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { newPassword, confirmPassword } = this.changePasswordForm.value;
      const data = {
        userId: this.cookies.decodeToken().userId, newPassword
      }
      if (newPassword === confirmPassword) {
        this.userService.changePassword(data).subscribe(
          (res) => {
            this.toastr.success('Password changed successfully!');
            this.changePasswordForm.reset();
            this.router.navigate(['/login']); 
          },
          (error) => this.toastr.error('Error changing password.')
        );
      } else {
        this.toastr.warning('Passwords do not match.');
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
