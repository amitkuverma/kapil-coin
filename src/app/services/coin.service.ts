import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coin } from './coin.model'; // Adjust the path according to your structure
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoinService {
  private baseUrl = environment.API_URL; // Adjust to your API endpoint

  constructor(private http: HttpClient) {}

  getCoins(): Observable<Coin[]> {
    return this.http.get<Coin[]>(this.baseUrl+ '/coins');
  }

  getCoinById(id: number): Observable<Coin> {
    return this.http.get<Coin>(`${this.baseUrl}/coin/${id}`);
  }

  createCoin(coin: Coin): Observable<Coin> {
    return this.http.post<Coin>(this.baseUrl+'/coins', coin);
  }

  updateCoin(coin: Coin, id:any): Observable<Coin> {
    return this.http.put<Coin>(`${this.baseUrl}/coin/${id}`, coin);
  }

  deleteCoin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/coin/${id}`);
  }
}
