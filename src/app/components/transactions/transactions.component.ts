import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from 'src/app/services/payment.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  displayedColumns: string[] = [
    'userName',
    'paymentType',
    'transactionId',
    'transactionAmount',
    'status',
    'receipt',
    'createdAt'
  ];
  dataSource = new MatTableDataSource<any>();
  paymentData: any;
  transactionData: any;
  selectedTab: string = 'internal'; // Track the currently selected tab

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private trancService: TransactionService, private paymentService: PaymentService) {
    this.fetchAccounts(this.selectedTab); // Default to 'internal' transactions
  }

  fetchAccounts(paymentType: string | string[]) {
    this.trancService.getAllTransaction().subscribe({
      next: (payments: any[]) => {
        // Filter based on single or multiple paymentTypes
        const filteredPayments = payments.filter(pay => {
          if (Array.isArray(paymentType)) {
            return paymentType.includes(pay.paymentType);
          } else {
            return pay.paymentType === paymentType;
          }
        });
        this.dataSource = new MatTableDataSource<any>(filteredPayments);
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => {
        console.error('Error fetching accounts:', error);
      }
    });
  }

  // Method to handle tab change and filter data based on tab selection
  selectTab(tab: string) {
    this.selectedTab = tab; // Update the selected tab
    if (tab === 'internal') {
      this.fetchAccounts('internal');
    } else if (tab === 'bank') {
      this.fetchAccounts(['buy', 'withdraw']);
    }
  }
}
