import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UsersService } from '../services/users.service';

interface UserNode {
  name: string;
  email: string;
  profilePic?: string;
  mobile?: string;
  referrals?: UserNode[];
}

@Component({
  selector: 'app-user-network-tree',
  templateUrl: './user-network-tree.component.html',
  styleUrls: ['./user-network-tree.component.scss']
})
export class UserNetworkTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<UserNode>(node => node.referrals);
  dataSource = new MatTreeNestedDataSource<UserNode>();
  selectedNode: UserNode | null = null;

  constructor(private usersService: UsersService) {} // Change to MockUsersService

  ngOnInit(): void {
    this.fetchReferralData(1);
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
}
