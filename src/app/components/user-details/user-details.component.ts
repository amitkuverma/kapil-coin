import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: any;

  constructor(private usersService: UsersService, private route: ActivatedRoute, public location: Location) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.usersService.getUserById(userId).subscribe((data: any) => {
      this.user = data;
    });
  }

  updateStatus(userId: number): void {
    this.usersService.updateUserStatus(userId, 'live').subscribe(() => {
      this.location.back()
    });
  }
}
