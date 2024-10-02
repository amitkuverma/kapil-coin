import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { PaymentService } from '../../services/payment.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-money-transfer',
  templateUrl: './money-transfer.component.html',
  styleUrls: ['./money-transfer.component.scss']
})
export class MoneyTransferComponent {
  internalTransferForm: FormGroup;
  bankTransferForm: FormGroup;
  userDetails: any = [];
  userPaymentDetails: any;
  selectedUser: any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    public dialog: MatDialog,
    private paymentService: PaymentService,
    public cookiesService: CookieService
  ) {
    this.internalTransferForm = this.fb.group({
      receiverUser: ['', Validators.required],
      coin: ['', [Validators.required, Validators.min(1)]],
    });

    this.bankTransferForm = this.fb.group({
      totatAccount: [{ value: '', disabled: true }, Validators.required], // Total amount is readonly
      enterCoin: ['', [Validators.required, Validators.min(500)]],
    });

    this.loadUserData();
  }

  // Fetch user data and payment details
  loadUserData() {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.userDetails = res;
      },
      (error: any) => {
        console.error(error);
      }
    );

    this.paymentService.getUserReferrals(this.cookiesService.decodeToken().userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;
          this.bankTransferForm.get('totatAccount')?.setValue(res.totalAmount); // Set the total amount
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  // Custom validator to check if withdrawal amount is less than or equal to the total amount
  // validateWithdrawalAmount(control: AbstractControl): { [key: string]: any } | null {
  //   const totalAmount = this.bankTransferForm.get('totatAccount')?.value;
  //   const enteredAmount = control.value;

  //   if (enteredAmount && totalAmount && enteredAmount > totalAmount) {
  //     return { exceededAmount: true }; // Error if the entered amount exceeds the total amount
  //   }
  //   return null; // No error
  // }

  openShareDialog() {
    this.selectedUser = this.userDetails.find(
      (user: any) => user.userId === this.internalTransferForm.get('receiverUser')?.value
    );
    this.dialog.open(this.shareDialog);
  }

  onSubmit() {
    if (this.bankTransferForm.valid) {
      const totalAmount = this.bankTransferForm.get('totatAccount')?.value;
      const enteredAmount = this.bankTransferForm.get('enterCoin')?.value;

      // Subtract the entered amount from the total amount
      const newTotal = totalAmount - enteredAmount;
      this.bankTransferForm.get('totatAccount')?.setValue(newTotal); // Update the total amount

      console.log(`New Total Amount: ${newTotal}`);
      console.log(this.selectedUser);
      
      // Additional logic for handling the transfer can go here
    }
  }
}
