import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: any;
  statusOptions: string[] = ['Active', 'Inactive', 'Suspended'];

  constructor(private usersService: UsersService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.usersService.getUserById(userId).subscribe((data:any) => {
      this.user = data;
    });
  }

  updateStatus(userId: number): void {
    this.usersService.updateUserStatus(userId, this.user.status).subscribe(() => {
      alert('Status updated successfully');
    });
  }
}
