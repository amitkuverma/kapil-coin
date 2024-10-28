import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AccountDetailsService } from '../../services/account.service';  // Import the service

export interface AccountData {
  userId: number;
  userName: string;
  bankName: string;
  branchName: string;
  accountType: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
}

@Component({
  selector: 'app-users-account-table',
  templateUrl: './users-account-table.component.html',
  styleUrls: ['./users-account-table.component.scss']
})
export class UsersAccountTableComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'bankName', 'accountNumber', 'ifscCode', 'branchName', 'accountType', 'accountHolderName'];
  dataSource = new MatTableDataSource<AccountData>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  paginatedData: any[] = [];
  pageSize = 100;
  pageIndex = 0;

  constructor(private accountService: AccountDetailsService) {}

  ngOnInit() {
    this.fetchAccounts();
  }

  fetchAccounts() {
    this.accountService.getAllAccounts().subscribe({
      next: (accounts: AccountData[]) => {
        this.dataSource = new MatTableDataSource<AccountData>(accounts);
        this.dataSource.paginator = this.paginator;
        this.updatePaginatedData();
      },
      error: (error:any) => {
        console.error('Error fetching accounts:', error);
      }
    });
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
