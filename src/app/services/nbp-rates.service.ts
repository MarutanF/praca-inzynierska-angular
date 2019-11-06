import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, catchError, delay, concatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../services/nbp-currencies.service';
import { Period, NBPPeriodService } from './nbp-period.service';

export interface Rate {
  rate: number;
  date: string;
  valid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NBPRatesService {
  apiURL = 'http://api.nbp.pl/api/';

  constructor(
    private http: HttpClient,
    private periodService: NBPPeriodService) { }

  getCurrentRateHttp(currency: Currency): Observable<any> {
    const currentRate = this.http.get<any>(`${this.apiURL}/exchangerates/rates/${currency.table}/${currency.code}/`)
      .pipe(
        map((res) => {
          return res.rates[0].mid;
        }));
    return currentRate;
  }

  getRateHttp(currency: Currency, date: string): Observable<Rate> {
    const rate = this.http.get<any>(`${this.apiURL}exchangerates/rates/${currency.table}/${currency.code}/${date}/`)
      .pipe(
        delay(1),
        catchError(err => of('not found')), // catch and replace strategy
        map((res) => {
          if (res === 'not found') {
            return { rate: 0, date, valid: false };
          } else {
            return { rate: res.rates[0].mid, date, valid: true };
          }
        }));
    return rate;
  }

  getRatesArrayHttp(currency: Currency, period: Period): Observable<Rate> {
    const arrayOfDates = this.periodService.getDatesArray(period);
    const ratesArray = from(arrayOfDates).pipe(
      concatMap(date => this.getRateHttp(currency, date))
    );
    return ratesArray;
  }

  getMockRatesArray(currency: Currency, period: Period) {
    let getExchangeRates;
    if (currency.code === 'USD') {
      getExchangeRates = {
        dates: ['2019-10-02', '2019-10-03', '2019-10-04'],
        values: [1, 2, 3]
      };
    } else {
      getExchangeRates = {
        dates: ['2019-10-02', '2019-10-03', '2019-10-04', '2019-10-05'],
        values: [3, 2, 1, 5]
      };
    }
    return getExchangeRates;
  }
}
