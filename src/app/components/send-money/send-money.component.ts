import { Component, ViewChild } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent {
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
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private trancService: TransactionService) {
    this.fetchAccounts();
  }

  fetchAccounts() {
    this.trancService.getAllTransaction().subscribe({
      next: (payment: any[]) => {
        const buyers = payment.filter((pay)=> pay.paymentType === 'withdraw')
        this.dataSource = new MatTableDataSource<any>(buyers);
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => {
        console.error('Error fetching accounts:', error);
      }
    });
  }
}

