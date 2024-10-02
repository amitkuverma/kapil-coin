import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { PaymentService } from '../../services/payment.service';
import { CookieService } from '../../services/cookie.service';

@Component({
  selector: 'app-money-transfer',
  templateUrl: './money-transfer.component.html',
  styleUrls: ['./money-transfer.component.scss']
})
export class MoneyTransferComponent {
  internalTransferForm: FormGroup;
  bankTransferForm: FormGroup;
  userDetails:any = [];
  userPaymentDetails:any;
  selectedUser:any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  

  constructor(private fb: FormBuilder, private userService:UsersService, public dialog: MatDialog, private paymentService: PaymentService, public cookiesService:CookieService) {
    this.internalTransferForm = this.fb.group({
      receiverUser: ['', Validators.required],
      coin: ['', [Validators.required, Validators.min(1)]],
    });
    this.bankTransferForm = this.fb.group({
      totatAccount: ['', Validators.required],
      enterCoin: ['', [Validators.required, Validators.min(100)]],
    });

    this.userService.getUsers().subscribe(
      (res:any)=>{
        this.userDetails = res;
      },
      (error:any)=>{
        console.log(error);
      }
    )
    this.paymentService.getUserReferrals(this.cookiesService.decodeToken().userId).subscribe(
      (res:any)=>{
        if(res){
          this.userPaymentDetails = res;
          this.bankTransferForm.get('totatAccount')?.setValue(res.totalAmount);
        }
      },
      (error:any)=>{
        console.log(error);
      }
    )

  }

  openShareDialog() {
    this.selectedUser = this.userDetails.find((user:any)=> user.userId === this.internalTransferForm.get('receiverUser')?.value);
    this.dialog.open(this.shareDialog);
  }

  onSubmit() {
    
    console.log(this.selectedUser);
    
    // if (this.internalTransferForm.valid) {
    //   console.log('Form Submitted', this.internalTransferForm.value);
    // }
  }
  onSubmitWithdrawal(){
    this.userPaymentDetails.status = 'withdraw'
    this.paymentService.updateUserStatus(this.userPaymentDetails, this.cookiesService.decodeToken().userId).subscribe(
      (res:any)=>{
        console.log(res);
      },
      (error:any)=>{
        console.log(error);
        
      }
    )
  }
}
