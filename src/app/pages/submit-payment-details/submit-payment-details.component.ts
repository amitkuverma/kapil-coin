import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { AccountDetailsService } from '../../services/account.service';
import { CookieService } from '../../services/cookie.service';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/uploadfile.service';
import { CoinService } from 'src/app/services/coin.service';

@Component({
  selector: 'app-submit-payment-details',
  templateUrl: './submit-payment-details.component.html',
  styleUrls: ['./submit-payment-details.component.scss']
})
export class CompletePaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  paymentSubmitted = false;
  receiptUploaded = false;
  showPaymentForm = false;
  showTotalAmount = false;
  selectedFile: File | null = null;
  accountDetails: any[] = []; // Store account details
  userDetails: any;
  type = 'payment';
  imageUrl!: string;
  loading = false; // Track loading state
  currentStep = 1; // Track the current step (1: Account, 2: Payment, 3: Upload, 4: Success)
  selectedMethod: string = '';
  selectedBank: string = ''; // Store selected bank name
  coin: any;
  amountInMoney: number = 0;
  amountInCoins: number = 0;
  convertedToMoney: number = 0;
  convertedToCoins: number = 0;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private accountService: AccountDetailsService,
    private cookiesService: CookieService,
    private router: Router,
    private uploadService: UploadService,
    private coinService: CoinService
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      earnAmount: [''],
      totalAmount: [null, [Validators.required, Validators.min(0)]],
      paymentMethod: [''],
      transactionId: [''],
      status: ['']
    });
    this.loadAccountDetails();
    this.loadUserInfo(this.cookiesService.decodeToken().userId);
    this.loadCoinDetails();
  }


  loadCoinDetails() {
    this.coinService.getCoinById(1).subscribe(
      (coin) => {
        this.coin = coin;
      }
    );
  }

  // Function to convert coin to money
  convertCoinToMoney(): void {
    if (this.coin) {
      this.convertedToMoney = this.amountInCoins * this.coin.coinRate;
    }
  }

  // Function to convert money to coin
  convertMoneyToCoin(): void {
    if (this.coin) {
      this.convertedToCoins = this.amountInMoney / this.coin.coinRate;
    }
  }

  loadAccountDetails() {
    this.loading = true; // Start loader
    this.accountService.getAllAccounts().subscribe(
      (data) => {
        this.accountDetails = data;
        this.loading = false; // Stop loader
      },
      (error) => {
        console.error('Error fetching account details', error);
        this.loading = false;
      }
    );
  }

  loadUserInfo(userId: any) {
    this.loading = true;
    this.paymentService.getUserReferrals(userId).subscribe(
      (data) => {
        this.userDetails = data;
        this.paymentForm.patchValue(this.userDetails);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching user details', error);
        this.loading = false;
      }
    );
  }

  goToNextStep() {
    this.showPaymentForm = true;
    this.currentStep = 2; // Move to payment form step
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.loading = true;
      const paymentData = {
        earnAmount: 0,
        totalAmount: this.paymentForm.get('totalAmount')?.value,
        paymentMethod: this.paymentForm.get('paymentMethod')?.value,
        transactionId: this.paymentForm.get('transactionId')?.value,
        status: 'new'
      };

      this.paymentService.createPayment(paymentData).subscribe(
        (response) => {
          this.paymentForm.reset();
          this.paymentSubmitted = true;
          this.loading = false;
          this.currentStep = 3; // Move to receipt upload step
        },
        (error) => {
          console.error('Error creating payment', error);
          this.loading = false;
        }
      );
    }
  }

  onPaymentMethodChange(paymentMethod: string) {
    if (paymentMethod === 'bank') {
      this.showTotalAmount = true;
      this.paymentForm.get('totalAmount')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      this.showTotalAmount = false;
      this.paymentForm.get('totalAmount')?.clearValidators();
    }
    this.paymentForm.get('totalAmount')?.updateValueAndValidity();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  upload(): void {
    if (this.selectedFile) {
      this.loading = true;
      this.uploadService.uploadFile(this.selectedFile, this.cookiesService.decodeToken().userId, this.type)
        .subscribe(
          (response) => {
            this.imageUrl = response.filepath;
            this.receiptUploaded = true;
            this.loading = false;
            this.currentStep = 4; // Move to success step
          },
          (error) => {
            console.error('Error uploading file', error);
            this.loading = false;
          }
        );
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  // Method to get selected bank details
  getSelectedBankDetails() {
    return this.accountDetails.find(account => account.bankName === this.selectedBank);
  }
}
