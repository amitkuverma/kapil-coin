import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {

    this.usersService.getUsers().subscribe(
      (response:any) => {
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator; // Set the paginator
      },
      (error:any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  goToUserNetwork(userId: number) {
    this.router.navigate(['/user-network', userId]);
  }

  goToUserDetails(userId: number): void {
    this.router.navigate(['/user-details', userId]);
  }
}
