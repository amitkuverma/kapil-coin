import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'src/app/services/cookie.service';
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
    'receiverName',
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

  constructor(private trancService: TransactionService, private cookies: CookieService) {
    this.fetchAccounts(this.selectedTab); // Default to 'internal' transactions
  }

  fetchAccounts(paymentType: string | string[]) {
    this.trancService.getAllTransaction().subscribe({
      next: (payments: any[]) => {
        let filteredPayments: any[];

        if (this.cookies.isAdmin()) {
          // If the user is an admin, filter by paymentType
          filteredPayments = payments.filter(pay => {
            if (Array.isArray(paymentType)) {
              return paymentType.includes(pay.paymentType);
            } else {
              return pay.paymentType === paymentType;
            }
          });
        } else {
          // If the user is not an admin, filter by userId as well
          const userId = this.cookies.decodeToken().userId;
          filteredPayments = payments.filter(pay => {
            const matchesPaymentType = Array.isArray(paymentType)
              ? paymentType.includes(pay.paymentType)
              : pay.paymentType === paymentType;

            // Only include payments that belong to the user
            return matchesPaymentType && pay.userId === userId;
          });
        }

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
