import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoinService } from '../../services/coin.service'; // Adjust the path according to your structure
import { Coin } from '../../services/coin.model'; // Adjust the path according to your structure
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.scss'],
})
export class CoinComponent implements OnInit {
  coinForm: FormGroup;
  coin: any;
  isEditMode: boolean = false;
  selectedCoinId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private coinService: CoinService,
    private toastr: ToastrService
  ) {
    this.coinForm = this.fb.group({
      coin:[1],
      coinRate: ['', [Validators.required, Validators.min(0)]],      
      coinType: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadCoins();
  }

  loadCoins() {
    this.coinService.getCoinById(1).subscribe(
      (coin) => {
        this.coin = coin;        
        this.coinForm.patchValue(coin)
        this.isEditMode = true;
      },
      (error) => {
        this.toastr.error('Failed to load coins.', 'Error');
        console.error('Error loading coins:', error);
      }
    );
  }

  onSubmit() {
    if (this.coinForm.valid) {
      const coin: any = this.coinForm.value;
      if (this.isEditMode) {
        coin.id = this.selectedCoinId;
        this.coinService.updateCoin(coin, 1).subscribe(
          () => {
            this.toastr.success('Coin updated successfully!', 'Success');
            this.resetForm();
            this.loadCoins();
          },
          (error) => {
            this.toastr.error('Failed to update coin.', 'Error');
            console.error('Error updating coin:', error);
          }
        );
      } else {
        this.coinService.createCoin(coin).subscribe(
          () => {
            this.toastr.success('Coin created successfully!', 'Success');
            this.resetForm();
            this.loadCoins();
          },
          (error) => {
            this.toastr.error('Failed to create coin.', 'Error');
            console.error('Error creating coin:', error);
          }
        );
      }
    }
  }

  editCoin(coin: any) {
    this.isEditMode = true;
    this.selectedCoinId = coin.id;
    this.coinForm.patchValue(coin);
  }

  resetForm() {
    this.coinForm.reset();
    this.isEditMode = false;
    this.selectedCoinId = null;
  }
}
