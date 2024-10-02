import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss']
})
export class FriendRequestComponent {
  referralLink = 'https://example.com/referral';  // Replace with your actual link
  copySuccess = false;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  

  constructor(public dialog: MatDialog) {}

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
