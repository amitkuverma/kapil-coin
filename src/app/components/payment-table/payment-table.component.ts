import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss']
})
export class PaymentTableComponent {
  displayedColumns: string[] = ['paymentId', 'userId', 'totalAmount', 'paymentMethod', 'transactionId', 'status', 'createdAt'];
  dataSource = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {

    this.paymentService.getAllReferUser().subscribe(
      (response:any) => {
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator; // Set the paginator
      },
      (error:any) => {
        console.error('Error fetching users', error);
      }
    );
  }
}

