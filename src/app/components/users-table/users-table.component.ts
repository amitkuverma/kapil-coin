import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['select', 'userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  searchQuery: FormControl<string | null> = new FormControl(null); // Specify the type here
  selection = new SelectionModel<any>(true, []); // Selection model for checkboxes

  @ViewChild('deleteUserDetailsDialog') deleteUserDetailsDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  paginatedData: any[] = [];
  pageSize = 100;
  pageIndex = 0;
  selectedUserId: any;

  constructor(private usersService: UsersService, private router: Router, private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.fetchUsers();

    // Subscribe to value changes in the search field
    this.searchQuery.valueChanges.subscribe(() => {
      this.applyFilter();
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
  fetchUsers(): void {
    this.usersService.getUsers().subscribe(
      (response: any) => {
        this.dataSource.data = response.filter((item: any) => item.status !== 'admin');
        this.dataSource.paginator = this.paginator; // Set the paginator
        this.updatePaginatedData();
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

  // Checkbox logic
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
  }

  // Send email function
  sendEmail() {
    let emails: string[] = [];

    if (this.selection.selected.length > 0) {
      // If users are selected, collect their emails
      emails = this.selection.selected.map(user => user.email);
    } else {
      // If no user is selected, collect all emails
      emails = this.dataSource.data.map(user => user.email);
    }

    if (emails.length > 0) {
      // Open default email client with all emails in the 'To' field
      const emailString = emails.join(',');
      const mailtoLink = `mailto:${emailString}`;
      window.location.href = mailtoLink;
    } else {
      console.log('No emails to send');
    }
  }


  deleteUser(): void {
    this.usersService.deleteUser(this.selectedUserId).subscribe(
      (response: any) => {
        this.snackBar.open('User deleted successfully!', 'Close', { duration: 3000 });

        // Remove user from the data source
        this.dataSource.data = this.dataSource.data.filter(user => user.userId !== this.selectedUserId);
        this.dialog.closeAll();
      },
      (error: any) => {
        console.error('Error deleting user', error);
        this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
      }
    );
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

  openShareDialog(userId: any) {
    this.selectedUserId = userId;
    this.dialog.open(this.deleteUserDetailsDialog, {
      disableClose: true // Prevent dialog from closing on backdrop click
    });
  }

  updateStatus(userId: number, status: string): void {
    this.usersService.updateUserStatus(userId, status).subscribe(
      (res: any) => {
        this.snackBar.open('User status update successfully!', 'Close', { duration: 3000 });
      })
    }

  closeModel() {
    this.dialog.closeAll();
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
