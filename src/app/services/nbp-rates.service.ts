import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, catchError, delay, concatMap, concat, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../services/nbp-currencies.service';
import { Period, NBPPeriodService } from './nbp-period.service';

export interface Rate {
  rate: number;
  date: string;
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

  getCurrentRatePromise(currency: Currency): Promise<number> {
    return this.http.get<any>(`${this.apiURL}/exchangerates/rates/${currency.table}/${currency.code}/`)
      .pipe(
        map((res) => {
          return res.rates[0].mid;
        })).toPromise()
      .then(value => { return value; });
  }

  getRateForDayHttp(currency: Currency, date: string): Observable<Rate> {
    const rate = this.http.get<any>(`${this.apiURL}exchangerates/rates/${currency.table}/${currency.code}/${date}/`)
      .pipe(
        delay(1),
        catchError(err => of('not found')), // catch and replace strategy
        filter(val => val !== 'not found'),
        map((res) => {
          return { rate: res.rates[0].mid, date };
        }));
    return rate;
  }

  async getRateForDayOrLastAvailableDay(currency: Currency, day: string): Promise<Rate> {
    let dayZero = day;
    let resultForDayZero: Rate;

    while (!resultForDayZero) {
      await this.getRateForDayHttp(currency, dayZero).toPromise()
        .then((value) => resultForDayZero = value);
      dayZero = this.periodService.minusOneDay(dayZero);
    }
    return resultForDayZero;
  }

  getRatesArrayHttp(currency: Currency, arrayOfDates: Array<string>): Observable<Rate> {
    const ratesArray = from(arrayOfDates).pipe(
      concatMap(date => this.getRateForDayHttp(currency, date))
    );
    return ratesArray;
  }

  checkNBPStatus() {
    return this.http.get<any>(`${this.apiURL}/exchangerates/rates/a/usd/`).toPromise().then(
      (value) => {
        return true;
      },
      (err) => {
        return false;
      }
    );
  }

}
