import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransactionService } from '../../services/transaction.service';
import { AccountDetailsService } from '../../services/account.service';

@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss']
})
export class AddMoneyComponent {
  accountDetails: any;
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  selectedFile: File | null = null;
  receiptUploaded = false;

  constructor(public accountService: AccountDetailsService, public dialog: MatDialog, private transService:TransactionService) {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadReceipt(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('receipt', this.selectedFile, this.selectedFile.name); // Append the file

      this.transService.uploadTransactionReceipt(formData).subscribe(
        (response) => {
          this.selectedFile = null; 
          this.receiptUploaded = true; 
        },
        (error:any) => {
          console.error('Error uploading receipt', error);
        }
      );
    } else {
      console.error('No file selected');
    }
  }

  openShareDialog() {
    this.dialog.open(this.shareDialog);
  }
}
