import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { AccountDetailsService } from '../../services/account.service';

@Component({
  selector: 'app-submit-payment-details',
  templateUrl: './submit-payment-details.component.html',
  styleUrls: ['./submit-payment-details.component.scss']
})
export class CompletePaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  paymentSubmitted = false;
  receiptUploaded = false; // Track receipt upload status
  showPaymentForm = false; // Control visibility of payment form
  selectedFile: File | null = null;
  accountDetails: any;

  constructor(private fb: FormBuilder, private paymentService: PaymentService, private accountService: AccountDetailsService) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]],
      paymentMethod: ['', Validators.required],
      transactionId: ['', Validators.required],
      status: [''], // Ensure status is part of the form
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

  hideAccountDetails() {
    this.accountDetails = null; // Set accountDetails to null to hide the card
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
        status: "new",
      };

      this.paymentService.createPayment(paymentData).subscribe(
        (response) => {
          console.log('Payment created successfully', response);
          this.paymentForm.reset();
          this.paymentSubmitted = true; // Set to true after successful payment
          this.showPaymentForm = false; // Hide payment form after submission
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
          this.receiptUploaded = true; // Set to true after successful receipt upload
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
