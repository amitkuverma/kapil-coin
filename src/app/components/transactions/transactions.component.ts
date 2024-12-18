import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'src/app/services/cookie.service';
import { PaymentService } from 'src/app/services/payment.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { environment } from 'src/environments/environment';

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
  paginatedData: any[] = [];
  pageSize = 100;
  pageIndex = 0;
  imageUrl: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private trancService: TransactionService, private cookies: CookieService) {
    this.fetchAccounts(this.selectedTab); // Default to 'internal' transactions
    this.imageUrl = environment.IMAGE_URL
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
        this.updatePaginatedData();
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
    } else if (tab === '7th') {
      this.fetchAccounts('7th');
    } else if (tab === 'coin') {
      this.fetchAccounts('coin');
    } 
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
