import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NBPService {

  constructor() { }

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

  getCurrenciesList() {
    const currenciesList =
      [
        { name: 'dolar amerykański', code: 'USD' },
        { name: 'euro', code: 'EUR' }
      ];
    return currenciesList;
  }


}
