import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  searchQuery: FormControl<string | null> = new FormControl(null); // Specify the type here

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();

    // Subscribe to value changes in the search field
    this.searchQuery.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  fetchUsers(): void {
    this.usersService.getUsers().subscribe(
      (response: any) => {
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator; // Set the paginator
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  applyFilter(): void {
    const filterValue = this.searchQuery.value?.trim().toLowerCase() || ''; // Ensure it's always a string

    // Set a custom filter predicate
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();
      return data.name.toLowerCase().includes(searchText) || data.email.toLowerCase().includes(searchText);
    };

    this.dataSource.filter = filterValue; // Trigger the filtering
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'live':
        return 'status-live';
      case 'paid':
        return 'status-paid';
      case 'admin':
        return 'status-admin';
      default:
        return 'status-other';
    }
  }

  goToUserNetwork(userId: number): void {
    this.router.navigate(['/friends-network', userId]);
  }

  goToUserDetails(userId: number): void {
    this.router.navigate(['/user-details', userId]);
  }

  goToPaymentDetails(userId: number): void {
    this.router.navigate(['/payment-details', userId]);
  }
}
