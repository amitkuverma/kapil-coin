import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;


  constructor(private fb: FormBuilder, private userService: UsersService, public dialog: MatDialog, private paymentService: PaymentService,
    public cookiesService: CookieService, private trancService: TransactionService, private toastr: ToastrService) {
    this.internalTransferForm = this.fb.group({
      receiverUser: ['', Validators.required],
      coin: ['', [Validators.required, Validators.min(1)]],
    });
    this.bankTransferForm = this.fb.group({
      totatAccount: ['', Validators.required],
      transactionAmount: ['', [Validators.required, Validators.min(100)]],
    });

    this.userService.getUsers().subscribe(
      (res: any) => {
        this.userDetails = res;
      },
      (error: any) => {
        console.log(error);
      }
    )
    this.paymentService.getUserReferrals(this.cookiesService.decodeToken().userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;
          this.bankTransferForm.get('totatAccount')?.setValue(res.totalAmount);
        }
      },
      (error: any) => {
        console.log(error);
      }
    )

  }

  openShareDialog() {
    this.selectedUser = this.userDetails.find((user: any) => user.userId === this.internalTransferForm.get('receiverUser')?.value);
    this.dialog.open(this.shareDialog);
  }

  onSubmit() {
    console.log(this.selectedUser);
  }

  onSubmitWithdrawal() {
    const data = {
      paymentType: 'withdraw',
      transactionAmount: this.bankTransferForm.get('transactionAmount')?.value
    }
    this.trancService.createTransaction(data).subscribe(
      (res: any) => {
        this.bankTransferForm.get('transactionAmount')?.setValue('');
        this.toastr.success('Withdrawal request send successful!', 'Success');
      },
      (error: any) => {
        this.toastr.error('Unable to send request!', 'Error');
      }
    )
  }
}
