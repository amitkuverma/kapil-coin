import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentComponent {
  paymentDetails: any;
  isLoading: boolean = false;
  userId:any;
  imageUrl:any;

  constructor(private usersService: UsersService, private route: ActivatedRoute, public location: Location, private paymentService: PaymentService,
    private toastr: ToastrService
  ) { 
    this.imageUrl = environment.IMAGE_URL
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.paymentService.getUserReferrals(this.userId).subscribe((data: any) => {
      this.paymentDetails = data;
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
