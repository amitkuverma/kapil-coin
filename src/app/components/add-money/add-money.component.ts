import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionService } from '../../services/transaction.service';
import { AccountDetailsService } from '../../services/account.service';
import { PaymentService } from 'src/app/services/payment.service';
import { CookieService } from 'src/app/services/cookie.service';
import { UploadService } from 'src/app/services/uploadfile.service';

@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss']
})
export class AddMoneyComponent {
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  type: string = 'transaction';
  accountDetails: any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  receiptUploaded = false;
  uploadedInfo: any;
  selectedMethod: string = '';
  selectedBank: string = ''; 
  paymentSubmitted!: boolean;
  loading!: boolean;
  currentStep!: number;

  constructor(public accountService: AccountDetailsService, public dialog: MatDialog, private paymentService: PaymentService,
    private transactionService: TransactionService, private cookiesService: CookieService, private uploadService: UploadService) {
  }
  ngOnInit(): void {
    // this.accountService.getAdminAccount().subscribe(
    //   (data) => {
    //     this.accountDetails = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching account details', error.error);
    //   }
    // );

  }
  onSubmit() {
    const body = {
      userId: this.cookiesService.decodeToken().userId,
      userName: this.cookiesService.decodeToken().userName,
      paymentType: 'buy',
      transactionAmount: 0
    };
    this.transactionService.createTransaction(body).subscribe(
      (res) => {
        this.uploadedInfo = res;
      }
    )
  }


  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  goToNextStep(step:number): void {
    const paymentData = {
      earnAmount: 0,
      totalAmount: 0,
      paymentMethod: 'bank',
      transactionId: '',
      status: 'new'
    };
    this.loading = true;

    this.paymentService.createPayment(paymentData).subscribe(
      (response) => {
        this.paymentSubmitted = true;
        this.loading = false;
        this.currentStep = step;
      },
      (error) => {
        console.error('Error creating payment', error);
        this.loading = false;
      }
    );

  }

  upload(): void {
    if (this.selectedFile) {
      this.uploadService.uploadFile(this.selectedFile, this.uploadedInfo.transId, this.type)
        .subscribe(
          response => {
            console.log('File uploaded successfully', response);
            this.receiptUploaded = true;
            // this.dialog.closeAll();
            this.imageUrl = response.filepath; // Adjust based on your response structure
          },
          error => {
            console.error('Error uploading file', error);
          }
        );
    }
  }

  getSelectedBankDetails() {
    return this.accountDetails.find((account:any) => account.bankName === this.selectedBank);
  }

  openShareDialog() {
    this.onSubmit();
    this.dialog.open(this.shareDialog);
  }
}
