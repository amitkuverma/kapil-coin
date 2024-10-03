import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { PaymentService } from '../../services/payment.service';
import { CookieService } from '../../services/cookie.service';
import { TransactionService } from '../../services/transaction.service';
import { ToastrService } from 'ngx-toastr';

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
  paymentInfo: any;
  payResult: any;
  transResult: any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;

  constructor(private fb: FormBuilder, private userService: UsersService, public dialog: MatDialog, private paymentService: PaymentService,
    public cookiesService: CookieService, private trancService: TransactionService, private toastr: ToastrService) {
    
    this.internalTransferForm = this.fb.group({
      receiverName: ['', Validators.required],
      transactionAmount: ['', [Validators.required, Validators.min(1)]],
    });
    
    this.bankTransferForm = this.fb.group({
      totalAmount: ['', Validators.required],
      transactionAmount: ['', [Validators.required, Validators.min(500)]],
    }, { validators: this.validateTransactionAmount });

    this.userService.getUsers().subscribe(
      (res: any) => {
        this.userDetails = res;
      },
      (error: any) => {
        console.log(error);
      }
    );

    this.paymentService.getUserReferrals(this.cookiesService.decodeToken().userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;
          this.bankTransferForm.get('totalAmount')?.setValue(res?.totalAmount);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  validateTransactionAmount(control: AbstractControl) {
    const totalAmount = control.get('totalAmount')?.value;
    const transactionAmount = control.get('transactionAmount')?.value;

    return transactionAmount <= totalAmount ? null : { amountExceeds: true };
  }

  transactionAmountExceeds(): boolean {
    const totalAmount = this.userPaymentDetails?.totalAmount || 0;
    const transactionAmount = this.internalTransferForm.get('transactionAmount')?.value || 0;
    return transactionAmount > totalAmount;
  }

  openShareDialog() {
    this.selectedUser = this.userDetails.find((user: any) => user.userId === this.internalTransferForm.get('receiverName')?.value);
    this.dialog.open(this.shareDialog);
  }

  onInternalSubmit() {
    // Validate transaction amount against total amount
    const totalAmount = this.userPaymentDetails?.totalAmount || 0;
    const transactionAmount = this.internalTransferForm.get('transactionAmount')?.value;

    if (transactionAmount > totalAmount) {
      this.toastr.error('Transaction amount must not exceed total amount.', 'Error');
      return;
    }

    const body = {
      userId: this.cookiesService.decodeToken().userId,
      userName: this.cookiesService.decodeToken().userName,
      receiverName: this.internalTransferForm.get('receiverName')?.value,
      paymentType: 'internal',
      transactionAmount: this.internalTransferForm.get('transactionAmount')?.value
    };
    
    this.trancService.createTransaction(body).subscribe(
      (transUpdate) => {
        this.internalTransferForm.get('transactionAmount')?.setValue('');
        this.dialog.closeAll();
        this.toastr.success('Internal transfer successful!', 'Success');
      },
      (error) => {
        this.toastr.error('Failed to create internal transfer.', 'Error');
      }
    );
  }

  onSubmitWithdrawal() {
    // Validate transaction amount against total amount
    const totalAmount = this.bankTransferForm.get('totalAmount')?.value;
    const transactionAmount = this.bankTransferForm.get('transactionAmount')?.value;

    if (transactionAmount > totalAmount) {
      this.toastr.error('Transaction amount must not exceed total amount.', 'Error');
      return;
    }

    const data = {
      paymentType: 'withdraw',
      transactionAmount: this.bankTransferForm.get('transactionAmount')?.value
    };

    this.trancService.createTransaction(data).subscribe(
      (res: any) => {
        this.bankTransferForm.get('transactionAmount')?.setValue('');
        this.toastr.success('Withdrawal request sent successfully!', 'Success');
      },
      (error: any) => {
        this.toastr.error('Unable to send request!', 'Error');
      }
    );
  }
}
