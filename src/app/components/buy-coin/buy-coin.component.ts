import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionService } from '../../services/transaction.service';
import { PaymentService } from '../../services/payment.service';
import { mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-buy-coin',
  templateUrl: './buy-coin.component.html',
  styleUrls: ['./buy-coin.component.scss']
})
export class BuyCoinComponent {
  displayedColumns: string[] = [
    'userName',
    'paymentType',
    'transactionId',
    'transactionAmount',
    'status',
    'receipt',
    'createdAt',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();
  paymentData: any;
  paymentInfo: any;
  transactionData: any;
  payResult: any;
  transResult: any;

  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private trancService: TransactionService,
    private paymentService: PaymentService,
    public dialog: MatDialog
  ) {
    this.fetchAccounts();
  }

  fetchAccounts() {
    this.trancService.getAllTransaction().subscribe({
      next: (payments: any[]) => {
        const buyers = payments.filter(pay => pay.paymentType === 'buy');
        this.dataSource = new MatTableDataSource<any>(buyers);
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => {
        console.error('Error fetching accounts:', error);
      }
    });
  }

  fetchTransaction(userId: string) {
    this.trancService.getUserTransactions(userId).subscribe({
      next: (transactions: any) => {
        if (Array.isArray(transactions)) {
          this.transactionData = transactions;
        } else {
          this.transactionData = [transactions]; // Ensure array
        }
      },
      error: (error: any) => {
        console.error('Error fetching transactions:', error);
      }
    });
  }

  openConfirmationDialog(payment: any) {
    const dialogRef = this.dialog.open(this.shareDialog);
    this.paymentInfo = payment;
    console.log(payment);
    this.getUserPaymentDetails();
    this.getUserTransactionDetails()

  }

  getUserPaymentDetails() {
    this.paymentService.getUserReferrals(this.paymentInfo.userId).subscribe(
      (trans) => {
        this.payResult = trans;
      }
    )
  }
  getUserTransactionDetails() {
    this.trancService.getUserTransactions(this.paymentInfo.transId).subscribe(
      (pay) => {
        this.transResult = pay;
      }
    )
  }

  sendCoin() {
    this.payResult.totalAmount -= this.transResult.transactionAmount;
    this.transResult.status = 'approved';

    this.paymentService.updateUserStatus(this.payResult, this.payResult.payId).subscribe(
      (payUpdate) => {
        if (payUpdate) {
          this.trancService.updateTransaction(this.transResult, this.transResult.transId).subscribe(
            (transUpdate) => {
              this.fetchAccounts();
              this.dialog.closeAll();
            }
          )
        }

      }
    )
  }
}
