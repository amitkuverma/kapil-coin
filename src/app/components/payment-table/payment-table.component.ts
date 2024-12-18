import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss']
})
export class PaymentTableComponent {
  displayedColumns: string[] = ['userName', 'totalAmount', 'paymentMethod', 'transactionId', 'status', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<any>();
  paginatedData: any[] = [];
  pageSize = 100;
  pageIndex = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private paymentService: PaymentService, private router: Router) {}

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

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'status-new';
      case 'receipt':
        return 'status-receipt';
      default:
        return 'status-other';
    }
  }

  goToUserDetails(userId: number): void {
    this.router.navigate(['/payment-details', userId]);
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

