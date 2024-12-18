import { Component, TemplateRef, ViewChild } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TransactionService } from 'src/app/services/transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AccountDetailsService } from 'src/app/services/account.service';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent {
  displayedColumns: string[] = [
    'userName',
    'paymentType',
    'receiverName',
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
  paginatedData: any[] = [];
  pageSize = 100;
  pageIndex = 0;
  imageUrl: any;
  accountDetails: any;

  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private trancService: TransactionService,
    private paymentService: PaymentService,
    public dialog: MatDialog,
    private accountService: AccountDetailsService
  ) {
    this.fetchAccounts();
    this.imageUrl = environment.IMAGE_URL;
  }

  fetchAccounts() {
    this.trancService.getAllTransaction().subscribe({
      next: (payments: any[]) => {
        const buyers = payments.filter(pay => pay.paymentType === 'withdraw');
        this.dataSource = new MatTableDataSource<any>(buyers);
        this.dataSource.paginator = this.paginator;
        this.updatePaginatedData();
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
    this.accountService.getAccountById(payment.transactionId).subscribe({
      next: (transactions: any) => {
        this.accountDetails = transactions
      },
      error: (error: any) => {
        this.accountDetails = null
        console.error('Error fetching transactions:', error);
      }
    });
    this.getUserPaymentDetails();
    this.getUserTransactionDetails()

  }

  getUserPaymentDetails() {
    this.paymentService.getPaymentReferrals(this.paymentInfo.userId).subscribe(
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

  actionCoinRequest(status:any) {
    if(status === 'rejected'){
      this.payResult.totalAmount -= this.transResult.transactionAmount;
    }
    this.transResult.status = status;

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
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.filteredData.slice(startIndex, endIndex);
    console.log(this.paginatedData)
  }
}
