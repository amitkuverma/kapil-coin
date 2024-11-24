import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { PaymentService } from '../../services/payment.service';
import { CookieService } from '../../services/cookie.service';
import { TransactionService } from '../../services/transaction.service';
import { ToastrService } from 'ngx-toastr';
import { AccountDetailsService } from 'src/app/services/account.service';

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
  userPaymentInfo: any;
  accountDetails: any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    public dialog: MatDialog,
    private paymentService: PaymentService,
    public cookiesService: CookieService,
    private trancService: TransactionService,
    private toastr: ToastrService,
    private accountService: AccountDetailsService
  ) {
    this.getAllUserPaymentDetails();
    this.getUserPayment();
    this.internalTransferForm = this.fb.group({
      receiverName: ['', Validators.required],
      transactionAmount: ['', [Validators.required, Validators.min(1)]],
    });

    this.bankTransferForm = this.fb.group({
      receiverName: ['', Validators.required],
      totalAmount: ['', Validators.required],
      transactionAmount: ['', [Validators.required, Validators.min(500)]],
    }, { validators: this.validateTransactionAmount });

    this.loadUsers();
    this.loadAccounts();
    this.getUserPayment();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.userDetails = res.filter((item: any) => item.status !== 'admin' && item.userId !== this.cookiesService.decodeToken().userId);
      },
      (error: any) => {
        this.toastr.error('Failed to load user details.', 'Error');
        console.error('Error fetching users:', error);
      }
    );
  }

  loadAccounts() {
    this.accountService.getAllAccounts().subscribe(
      (res: any) => {
        this.accountDetails = res.filter((item: any) => item.userId === this.cookiesService.decodeToken().userId);
      },
      (error: any) => {
        this.toastr.error('Failed to load user details.', 'Error');
        console.error('Error fetching users:', error);
      }
    );
  }

  activateUserIfTransferExceeds300(receiver: any) {
    this.userService.updateUserStatus(receiver.userId, 'active').subscribe(
      (res) => {
        this.toastr.success(`${receiver.userName} is active.`, 'success');
      },
      (error: any) => {
        this.toastr.error('Failed to update user status.', 'Error');
        console.error('Error fetching user payment details:', error);
      }
    );
  }


  getUserPayment() {
    const userId = this.cookiesService.decodeToken().userId;
    this.paymentService.getPaymentReferrals(userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;
          this.bankTransferForm.get('totalAmount')?.setValue(res?.totalAmount);
        }
      },
      (error: any) => {
        this.toastr.error('Failed to load user payment details.', 'Error');
        console.error('Error fetching user payment details:', error);
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
    const selectedUserId = this.internalTransferForm.get('receiverName')?.value;
    this.selectedUser = this.userDetails.find((user: any) => user.userId === selectedUserId);
    this.dialog.open(this.shareDialog);
  }

  getAllUserPaymentDetails() {
    this.paymentService.getAllReferUser().subscribe(
      (res) => {
        this.userPaymentInfo = res;
      },
      (error: any) => {
        this.toastr.error('Failed to load all user payment details.', 'Error');
        console.error('Error fetching all user payment details:', error);
      }
    );
  }

  onInternalSubmit() {
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
      transactionAmount: transactionAmount
    };

    const selectedUserId = this.internalTransferForm.get('receiverName')?.value;
    const senderUser = this.userPaymentInfo.find((user: any) => user.userId === this.cookiesService.decodeToken().userId);
    const receiverUser = this.userPaymentInfo.find((user: any) => user.userId === selectedUserId);

    body.receiverName = receiverUser.userName;
    this.trancService.createTransaction(body).subscribe(
      (transUpdate) => {
        senderUser.totalAmount -= transactionAmount;
        receiverUser.totalAmount += transactionAmount;
        
        this.updateUserStatus(senderUser, receiverUser);
        const userInfo = this.userDetails.find((item: any) => item.userId === receiverUser.userId);
        
        if (userInfo.status !== 'active' && receiverUser.totalAmount >= 300) {
          this.activateUserIfTransferExceeds300(receiverUser);
        }
      },
      (error) => {
        this.toastr.error('Failed to create internal transfer.', 'Error');
        console.error('Error creating internal transfer:', error);
      }
    );
  }

  updateUserStatus(senderUser: any, receiverUser: any) {
    this.paymentService.updateUserStatus(senderUser, senderUser.payId).subscribe(
      () => {
        this.paymentService.updateUserStatus(receiverUser, receiverUser.payId).subscribe(
          () => {
            this.getUserPayment();
            this.dialog.closeAll();
            this.toastr.success('Internal transfer successful!', 'Success');
            this.internalTransferForm.get('transactionAmount')?.setValue('');
          },
          (error) => {
            this.toastr.error('Failed to update receiver status.', 'Error');
            console.error('Error updating receiver status:', error);
          }
        );
      },
      (error) => {
        this.toastr.error('Failed to update sender status.', 'Error');
        console.error('Error updating sender status:', error);
      }
    );
  }

  onSubmitWithdrawal() {
    const totalAmount = this.bankTransferForm.get('totalAmount')?.value;
    const transactionAmount = this.bankTransferForm.get('transactionAmount')?.value;

    if (transactionAmount > totalAmount) {
      this.toastr.error('Transaction amount must not exceed total amount.', 'Error');
      return;
    }

    const data = {
      paymentType: 'withdraw',
      transactionAmount: transactionAmount,
      receiverName: this.bankTransferForm.get('receiverName')?.value
    };

    this.trancService.createTransaction(data).subscribe(
      (res: any) => {
        const payUser = this.userPaymentInfo.find((user: any) => user.userId === this.cookiesService.decodeToken().userId);

        payUser.totalAmount -= transactionAmount
        
        this.paymentService.updateUserStatus(payUser, payUser.payId).subscribe(
          response=>{
            this.toastr.success('Withdrawal request sent successfully!', 'Success');
            this.bankTransferForm.get('receiverName')?.setValue('');
            this.bankTransferForm.get('transactionAmount')?.setValue('');
          },
          (err:any)=>{
            this.toastr.error(err.error.message)
          }
        );
      },
      (error: any) => {
        this.toastr.error('Unable to send withdrawal request!', 'Error');
        console.error('Error sending withdrawal request:', error);
      }
    );
  }
}
