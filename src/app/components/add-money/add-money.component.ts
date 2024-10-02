import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AccountDetailsService } from 'src/app/services/account.service';

@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss']
})
export class AddMoneyComponent {
  accountDetails: any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  paymentForm!: FormGroup;

  constructor(public accountService: AccountDetailsService, public dialog: MatDialog, private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      earnAmount: [''],
      totalAmount: [null, [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      transactionId: ['', Validators.required],
      status: [''], // Ensure status is part of the form
    });
  }
  ngOnInit(): void {
    this.accountService.getAdminAccount().subscribe(
      (data) => {
        this.accountDetails = data;
      },
      (error) => {
        console.error('Error fetching account details', error.error);
      }
    );

  }
  onSubmit(){
    
  }

  openShareDialog() {
    this.dialog.open(this.shareDialog);
  }
}
