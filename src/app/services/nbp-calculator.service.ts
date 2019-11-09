import { Injectable } from '@angular/core';
import { Currency } from '../services/nbp-currencies.service';
import { Observable, of, from, zip } from 'rxjs';
import { NBPRatesService } from './nbp-rates.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NBPCalculatorService {

  constructor(private ratesService: NBPRatesService) { }

  convertRate(from: Currency, to: Currency): Observable<any> {
    //console.log(to);
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
