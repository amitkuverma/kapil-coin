import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionService } from '../../services/transaction.service';
import { PaymentService } from '../../services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buy-coin',
  templateUrl: './buy-coin.component.html',
  styleUrls: ['./buy-coin.component.scss']
})
export class BuyCoinComponent {
  displayedColumns: string[] = [
    'userName',
    'createdAt',
    'paymentType',
    'status',
    'receipt',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();
  paymentData: any;
  paymentInfo: any;
  transactionData: any;
  payResult: any;
  transResult: any;
  imageUrl: string | null = null;
  paginatedData: any[] = [];
  pageSize = 100;
  pageIndex = 0;

  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private trancService: TransactionService,
    private paymentService: PaymentService,
    public dialog: MatDialog
  ) {
    this.fetchAccounts();
    this.imageUrl = environment.IMAGE_URL;
  }

  fetchAccounts() {
    this.trancService.getAllTransaction().subscribe({
      next: (payments: any[]) => {
        const buyers = payments.filter(pay => pay.paymentType === 'buy' && pay.status === 'pending');
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

  sendCoin() {
    this.payResult.totalAmount =
      (parseFloat(this.payResult.totalAmount) || 0) +
      (parseFloat(this.paymentInfo.totalAmount) || 0);
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
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.filteredData.slice(startIndex, endIndex);
  }
}
