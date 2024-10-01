import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Location } from '@angular/common';
import { CookieService } from '../../services/cookie.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: any;
  isLoading: boolean = false;

  constructor(private usersService: UsersService, private route: ActivatedRoute, public location: Location, public cookies: CookieService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.usersService.getUserById(userId).subscribe((data: any) => {
      this.user = data;
    });
  }

  updateStatus(userId: number, status: string): void {
    this.isLoading = true
    this.usersService.updateUserStatus(userId, status).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.location.back();
      },
      (error: any) => {
        this.isLoading = false;
        this.toastr.error(error, "Error")
      }
    );
  }
}
