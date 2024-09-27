import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AccountDetailsService } from '../../services/account.service';
@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
  accountForm!: FormGroup;
  accountDetails: any = null; // Fetch the account details from API or service
  isViewing: boolean = true;  // Default to viewing mode
  isEditing: boolean = false;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private accountService: AccountDetailsService) { }

  ngOnInit(): void {
    // Initialize form controls
    this.accountForm = this.fb.group({
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      accountType: ['', Validators.required],
    });

    // Load account details (Example: Fetch from API)
    this.loadAccountDetails();
  }


  loadAccountDetails() {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe(
      (data) => {
        this.accountDetails = data;
        this.isViewing = true;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching account details', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    this.isLoading = true;
    if (this.isEditing) {
      this.accountService.saveAccount(this.accountForm.value).subscribe(
        () => {
          this.loadAccountDetails();
          this.isLoading = false;
          this.isEditing = false;
        },
        (error: any) => {
          console.error('Error saving account', error);
          this.isLoading = false;
        }
      );
    }
  }

  deleteAccount(accId: any) {
    if (confirm('Are you sure you want to delete this account?')) {
      this.isLoading = true;
      this.accountService.deleteAccount(accId).subscribe(
        () => {
          this.loadAccountDetails();
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Error deleting account', error);
          this.isLoading = false;
        }
      );
    }
  }

  editAccount() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.accountForm.patchValue(this.accountDetails);  // Reset form to original values
  }

  addNewAccount() {
    this.isEditing = true;
    this.accountDetails = null;
    this.accountForm.reset();  // Reset form for a new account
  }
}
