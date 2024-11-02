import { Location } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentComponent {
  paymentDetails: any;
  isLoading: boolean = false;
  userId: any;
  imageUrl: any;
  addAmount:any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;

  constructor(public dialog: MatDialog, private usersService: UsersService, private route: ActivatedRoute, public location: Location, private paymentService: PaymentService,
    private toastr: ToastrService, private cookies: CookieService
  ) {
    this.imageUrl = environment.IMAGE_URL
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getPaymentData();
  }

  getPaymentData() {
    this.paymentService.getPaymentReferrals(this.userId).subscribe((data: any) => {
      this.paymentDetails = data;
    });
  }

  updateStatus(userId: number, status: string): void {
    this.isLoading = true
    this.usersService.updateUserStatus(userId, status).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.usersService.getUserParentReferrals(userId).subscribe(
          (response: any) => {
            console.log(response);
            
            const activeReferUsers = response.filter((item: any) => item.status === 'active')
            console.log(activeReferUsers.length);
            
            if (activeReferUsers.length === 8) {
              this.paymentService.getPaymentReferrals(response[7].userId).subscribe((data: any) => {
                data.totalAmount += 100;
                this.paymentService.updateUserStatus(data, data.payId).subscribe(
                  res => {
                    console.log(res);
                  },
                  error => {
                    console.log(error);
                  }
                )
              });

            }
          },
          (error: any) => {
            console.error('Error fetching user referrals:', error);
          }
        );
        this.getPaymentData();
      },
      (error: any) => {
        this.isLoading = false;
        this.toastr.error(error, "Error")
      }
    );
  }

  openShareDialog() {
    this.dialog.open(this.shareDialog);
  }

  addPayment(): void {
    this.isLoading = true
    this.paymentDetails.totalAmount = parseInt(this.paymentDetails.totalAmount) + parseInt(this.addAmount);
    this.paymentService.updateUserStatus(this.paymentDetails, this.paymentDetails.payId).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.dialog.closeAll();
        this.location.back();
      },
      (error: any) => {
        this.isLoading = false;
        this.toastr.error(error, "Error")
      }
    );
  }
}
