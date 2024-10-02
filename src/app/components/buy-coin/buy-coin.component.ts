import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionService } from '../../services/transaction.service';
import { PaymentService } from '../../services/payment.service';
import { mergeMap } from 'rxjs/operators';

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
  transactionData: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private trancService: TransactionService, private paymentService: PaymentService) {
    this.fetchAccounts();
  }

  fetchAccounts() {
    this.trancService.getAllTransaction().subscribe({
      next: (payments: any[]) => {
        const buyers = payments.filter(pay => pay.paymentType === 'add');
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
        console.log(transactions); // Log the response structure
        if (Array.isArray(transactions)) {
          this.transactionData = transactions;
        } else {
          // Handle case where the response is a single object or different format
          this.transactionData = [transactions]; // Ensure it's an array
        }
      },
      error: (error: any) => {
        console.error('Error fetching transactions:', error);
      }
    });
  }

  sendCoin(payment: any) {
    this.paymentService.getUserReferrals(payment.userId).pipe(
      mergeMap((userReferrals: any) => {
        return this.trancService.getUserTransactions(payment.userId).pipe(
          mergeMap((transactions: any) => {
            console.log(transactions); // Log the transactions response

            // Ensure transactions is an array
            const transactionArray = Array.isArray(transactions) ? transactions : [transactions];

            const transaction = transactionArray.find(t => t.transId === payment.transId);
            if (transaction) {
              userReferrals.totalAmount -= transaction.transactionAmount;
              transaction.status = 'approved';

              // Update user status and then update the transaction
              return this.paymentService.updateUserStatus(userReferrals, payment.userId).pipe(
                mergeMap(() => this.trancService.updateTransaction(transaction, transaction.transId))
              );
            } else {
              throw new Error('Transaction not found');
            }
          })
        );
      })
    ).subscribe({
      next: (result) => {
        console.log('Transaction and user status updated successfully');
      },
      error: (error: any) => {
        console.error('Error during coin sending process:', error);
      }
    });
  }
}
