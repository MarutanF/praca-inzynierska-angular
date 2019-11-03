import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NBPService {
  apiURL: string = 'http://api.nbp.pl/api/';

  constructor(private http: HttpClient) { }

  getExchangeRates(code, startDate, endDate) {
    let getExchangeRates;
    if (code === 'USD') {
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

}

