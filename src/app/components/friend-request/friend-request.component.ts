import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { CookieService } from 'src/app/services/cookie.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss']
})
export class FriendRequestComponent { // Replace with your actual link
  copySuccess = false;
  userInfo:any;
  referralLink:any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  

  constructor(public dialog: MatDialog, private userService:UsersService, public cookies:CookieService) {
    userService.getUserById(cookies.decodeToken().userId).subscribe(
      (res)=>{
        this.userInfo = res;
        this.referralLink = `${environment.UI_URL}/register?referralCode=${this.userInfo.referralCode}`
      }
    )
  }

  copyReferralLink() {
    const inputElement = document.getElementById('referral-url') as HTMLInputElement;
    inputElement.select();
    document.execCommand('copy');
    this.copySuccess = true;
    setTimeout(() => this.copySuccess = false, 3000);  // Hide success message after 3 seconds
  }

  openShareDialog() {
    this.dialog.open(this.shareDialog);
  }
}
