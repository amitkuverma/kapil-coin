import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountDetailsService } from '../../services/account.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
  accountForm!: FormGroup;
  accountDetailsList: any[] = []; // List of all accounts
  accountDetails: any = null; // Selected account details for edit/view
  isEditing: boolean = false;
  isLoading: boolean = false;
  formType!: string;
  userId!: number;
  userName!: string;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountDetailsService,
    private cookies: CookieService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.cookies.decodeToken().userId;
    this.userName = this.cookies.decodeToken().userName;

    // Initialize form controls
    this.accountForm = this.fb.group({
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      accountType: ['', Validators.required],
    });

    // Load account details (from API)
    this.loadAccountDetails();
  }

  loadAccountDetails() {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe(
      (data: any[]) => {
        this.accountDetailsList = data.filter(user=> user.userId = this.userId);
        this.isLoading = false;
      },
      (error:any) => {
        this.toastr.error('Error fetching account details');
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      return;
    }

    this.isLoading = true;
    const accountData = this.accountForm.value;

    if (this.isEditing) {
      // Update account
      this.accountService.updateAccount(accountData, this.accountDetails.accId).subscribe(
        () => {
          this.toastr.success('Account updated successfully');
          this.loadAccountDetails();
          this.isLoading = false;
          this.isEditing = false;
        },
        (error) => {
          this.toastr.error('Error updating account');
          this.isLoading = false;
        }
      );
    } else {
      // Save new account
      this.accountService.saveAccount(accountData).subscribe(
        () => {
          this.toastr.success('Account added successfully');
          this.loadAccountDetails();
          this.isLoading = false;
          this.isEditing = false;
        },
        (error) => {
          this.toastr.error('Error adding account');
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
          this.toastr.success('Account deleted successfully');
          this.loadAccountDetails();
          this.isLoading = false;
        },
        (error) => {
          this.toastr.error('Error deleting account');
          this.isLoading = false;
        }
      );
    }
  }

  editAccount(account: any) {
    this.formType = 'Edit';
    this.isEditing = true;
    this.accountDetails = account;
    this.accountForm.patchValue(account);
  }

  cancelEdit() {
    this.isEditing = false;
    this.accountForm.reset(); // Reset form after canceling
  }

  addNewAccount() {
    this.formType = 'Add';
    this.isEditing = true;
    this.accountDetails = null;
    this.accountForm.reset(); // Clear form for new account
  }

  filterAccountData(userId: number) {
    return this.accountDetailsList.filter(account => account.userId === userId);
  }
}
