import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { AccountDetailsService } from '../../services/account.service';

@Component({
  selector: 'app-complete-payment',
  templateUrl: './complete-payment.component.html',
  styleUrls: ['./complete-payment.component.scss']
})
export class CompletePaymentComponent {
  paymentForm!: FormGroup;
  paymentSubmitted = false;
  selectedFile: File | null = null;
  accountDetails:any;
  statusOptions:any = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' },
    { value: 'pending', viewValue: 'Pending' }
  ];

  constructor(private fb: FormBuilder, private paymentService: PaymentService, private accountService: AccountDetailsService) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      transactionId: ['', Validators.required],
      status: ['', Validators.required], // Ensure status is part of the form
    });
    this.loadAccountDetails();
  }

  loadAccountDetails() {
    this.accountService.getAdminAccount().subscribe(
      (data) => {
        this.accountDetails = data;
      },
      (error) => {
        console.error('Error fetching account details', error.error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData = {
        totalAmount: this.paymentForm.get('amount')?.value,
        paymentMethod: this.paymentForm.get('paymentMethod')?.value,
        transactionId: this.paymentForm.get('transactionId')?.value,
        status: this.paymentForm.get('status')?.value,
      };

      this.paymentService.createPayment(paymentData).subscribe(
        (response) => {
          console.log('Payment created successfully', response);
          this.paymentForm.reset();
          this.paymentSubmitted = true; // Set to true after successful payment
          this.selectedFile = null; // Reset file selection
        },
        (error) => {
          console.error('Error creating payment', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  uploadReceipt(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('receipt', this.selectedFile, this.selectedFile.name); // Append the file

      this.paymentService.uploadReceipt(formData).subscribe(
        (response) => {
          console.log('Receipt uploaded successfully', response);
          this.selectedFile = null; // Reset file after successful upload
        },
        (error) => {
          console.error('Error uploading receipt', error);
        }
      );
    } else {
      console.error('No file selected');
    }
  }
}