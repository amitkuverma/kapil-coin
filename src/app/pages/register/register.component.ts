import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registrationSuccess:boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
          ]
        ],
        confirmPassword: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        referralCode:['']
      },
      { validator: this.checkPasswords } // Attach the custom validator here
    );
    this.route.queryParamMap.subscribe(params => {
      const referralCode = params.get('referralCode');
      
      if (referralCode) {
        // Set the referral code in the form control
        this.registerForm.get('referralCode')?.setValue(referralCode);

        // Disable the referralCode field
        this.registerForm.get('referralCode')?.disable();
      }
    });
  }

  // Custom validator for password match
  checkPasswords(group: FormGroup) {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');
  
    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;
  
      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null); // Clear errors when passwords match
      }
    }
  }
  

  onSubmit() {
    this.registerForm.get('referralCode')?.enable();
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response:any) => {
          this.registrationSuccess = true;
        },
        (error:any) => {
          console.error('Registration failed', error);
        }
      );
    }
  }

  login(){
    this.router.navigate(['/login']);
  }
}
