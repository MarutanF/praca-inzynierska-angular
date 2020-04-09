import { Injectable } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Currency } from '../services/nbp-currencies.service';
import { NBPRatesService } from './nbp-rates.service';

@Injectable({
  providedIn: 'root'
})
export class NBPCalculatorService {

  constructor(private ratesService: NBPRatesService) { }

  convertRate(from: Currency, to: Currency): Observable<any> {
    if (from.code === 'PLN' && to.code === 'PLN') {
      return of(1);
    }
    if (from.code === 'PLN') {
      // return 1/rate(to)
      return this.ratesService.getCurrentRateHttp(to).pipe(
        map(value => 1 / value)
      );
    }
    if (to.code === 'PLN') {
      // return rate(from)
      return this.ratesService.getCurrentRateHttp(from);
    }
    // return rate(from) * 1/rate(to)
    let rateFrom = this.ratesService.getCurrentRateHttp(from);
    let rateTo = this.ratesService.getCurrentRateHttp(to).pipe(
      map(value => 1 / value)
    );
    let result = zip(rateFrom, rateTo).pipe(
      map(value => value[0] * value[1])
    );
    return result;
  }
}
