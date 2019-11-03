import { Injectable } from '@angular/core';
import { Observable, zip, empty, of } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../services/nbp-currencies.service';
import { Period } from './period.service';

export interface Rate {
  rate: number;
  date: string;
  valid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NBPService {
  apiURL: string = 'http://api.nbp.pl/api/';

  constructor(private http: HttpClient) { }

  getExchangeRates(currency: Currency, period: Period) {
    let getExchangeRates;
    if (currency.code === 'USD') {
      getExchangeRates = {
        dates: ['2019-10-02', '2019-10-03', '2019-10-04'],
        values: [4.0152, 3.9652, 3.9469]
      };
    } else {
      getExchangeRates = {
        dates: ['2019-10-02', '2019-10-03', '2019-10-04'],
        values: [4.2, 5.9652, 4.9469]
      };
    }
    return getExchangeRates;
  }

  getCurrentRateHttp(currency: Currency): Observable<any> {
    let currentRate = this.http.get<any>(`${this.apiURL}/exchangerates/rates/${currency.table}/${currency.code}/`)
      .pipe(
        map((res) => {
          return res.rates[0].mid;
        }));
    return currentRate;
  }

  getRateHttp(currency: Currency, date: string): Observable<Rate> {
    let rate = this.http.get<any>(`${this.apiURL}/exchangerates/rates/${currency.table}/${currency.code}/${date}/`)
      .pipe(
        catchError(err => of('not found')), // catch and replace strategy
        map((res) => {
          if (res === 'not found') {
            return { rate: 0, date: date, valid: false };
          } else {
            return { rate: res.rates[0].mid, date: date, valid: true };
          }
        }));
    return rate;
  }

}

