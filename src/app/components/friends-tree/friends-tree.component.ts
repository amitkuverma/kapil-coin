import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface UserNode {
  name: string;
  email: string;
  profilePic?: string;
  mobile?: string;
  referrals?: UserNode[];
}

@Component({
  selector: 'app-friends-tree',
  templateUrl: './friends-tree.component.html',
  styleUrls: ['./friends-tree.component.scss']
})
export class UserNetworkTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<UserNode>(node => node.referrals);
  dataSource = new MatTreeNestedDataSource<UserNode>();
  selectedNode: UserNode | null = null;

  constructor(private usersService: UsersService, private route: ActivatedRoute, public location: Location) { } // Change to MockUsersService

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId']; // Capture userId from the route
      this.fetchReferralData(userId);   // Use the userId to fetch data
    });
  }

  fetchReferralData(userId: any): void {
    this.usersService.getUserReferrals(userId)
      .subscribe((data: any) => {
        const formattedData = this.formatReferralData(data);
        this.dataSource.data = formattedData;
      });
  }

  formatReferralData(data: any): UserNode[] {
    return [this.formatUserNode(data)]; // Adjust to handle single user data
  }

  formatUserNode(userObj: any): UserNode {
    return {
      name: userObj.user.name,
      email: userObj.user.email,
      profilePic: 'assets/profile.png', // Placeholder for profile picture
      mobile: userObj.user.mobile,
      referrals: userObj.referrals.map((referral: any) => this.formatReferral(referral))
    };
  }

  formatReferral(referral: any): UserNode {
    return {
      name: referral.user.name,
      email: referral.user.email,
      profilePic: 'assets/profile.png', // Placeholder for profile picture
      mobile: referral.user.mobile,
      referrals: referral.referrals.map((subReferral: any) => this.formatReferral(subReferral)) // Recursive call
    };
  }

  hasChild = (_: number, node: UserNode) => !!node.referrals && node.referrals.length > 0;

  selectNode(node: UserNode): void {
    this.selectedNode = node;
  }

  shareUrl(referralCode: any): void {
    const urlToShare = 'https://example.com'; // Replace with your desired URL

    if (navigator.share) {
      navigator.share({
        title: 'Check this out!',
        text: 'I want you to see this URL.',
        url: urlToShare + "?referralCode=" + referralCode
      })
        .then(() => console.log('Share successful'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert('Share this URL: ' + urlToShare);
    }
  }
}
