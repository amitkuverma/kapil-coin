import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentComponent {
  paymentDetails: any;
  isLoading: boolean = false;

  constructor(private usersService: UsersService, private route: ActivatedRoute, public location: Location, private paymentService:PaymentService) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.paymentService.getUserReferrals(userId).subscribe((data: any) => {
      this.paymentDetails = data;
    });
  }


}
