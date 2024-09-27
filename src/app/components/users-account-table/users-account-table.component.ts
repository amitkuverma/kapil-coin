import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AccountDetailsService } from '../../services/account.service';  // Import the service

export interface AccountData {
  userId: number;
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
  displayedColumns: string[] = ['userId', 'bankName', 'branchName', 'accountType', 'accountHolderName', 'accountNumber', 'ifscCode'];
  dataSource = new MatTableDataSource<AccountData>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private accountService: AccountDetailsService) {}

  ngOnInit() {
    this.fetchAccounts();
  }

  fetchAccounts() {
    this.accountService.getAllAccounts().subscribe({
      next: (accounts: AccountData[]) => {
        this.dataSource = new MatTableDataSource<AccountData>(accounts);
        this.dataSource.paginator = this.paginator;
      },
      error: (error:any) => {
        console.error('Error fetching accounts:', error);
      }
    });
  }
}
