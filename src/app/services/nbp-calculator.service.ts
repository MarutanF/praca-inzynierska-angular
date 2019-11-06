import { Injectable } from '@angular/core';
import { Currency } from '../services/nbp-currencies.service';

@Injectable({
  providedIn: 'root'
})
export class NBPCalculatorService {

  constructor() { }

  getCurrenciesListFormattedForCalculator(currenciesList: Array<Currency>): Array<Currency>{
    const plnCurrency: Currency = {
      code: 'PLN',
      name: 'polski złoty',
      groupCode: 'Favorite'
    };
    currenciesList.unshift(plnCurrency);
    return currenciesList;
  }
}
