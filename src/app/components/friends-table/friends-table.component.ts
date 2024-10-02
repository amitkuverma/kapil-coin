import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-friends-table',
  templateUrl: './friends-table.component.html',
  styleUrls: ['./friends-table.component.scss']
})
export class FriendsTableComponent {
  // Columns to display in the table
  displayedColumns: string[] = ['name', 'email', 'mobile', 'referralCode', 'status', 'expand'];
  dataSource = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  expandedElement: any | null = null; // Initialize expandedElement to null

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    // Fetch data from the service
    this.usersService.getFrinfReferrals().subscribe(
      (response: any) => {
        this.dataSource = response;
        this.dataSource.paginator = this.paginator; // Set the paginator
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  // Toggle to expand or collapse the row showing referrals
  toggleRow(row: any) {
    // If the row clicked is already expanded, collapse it
    if (this.expandedElement === row) {
      this.expandedElement = null;
    } else {
      // Otherwise, expand the new row and collapse any other
      this.expandedElement = row;
    }
  }
}
