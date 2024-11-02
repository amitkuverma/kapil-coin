import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-friends-table',
  templateUrl: './friends-table.component.html',
  styleUrls: ['./friends-table.component.scss']
})
export class FriendsTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'mobile', 'referralCode', 'status'];
  dataSource = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  paginatedData: any[] = [];
  pageSize = 100;
  pageIndex = 0;

  constructor(private usersService: UsersService, private cookies: CookieService) {}

  ngOnInit(): void {
    this.fetchUserReferrals();
  }

  fetchUserReferrals(): void {
    this.usersService.getParentReferrals(this.cookies.decodeToken().userId).subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response.referrals);
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        console.error('Error fetching user referrals:', error);
      }
    );
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
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'admin':
        return 'status-admin';
      default:
        return 'status-other';
    }
  }
}
