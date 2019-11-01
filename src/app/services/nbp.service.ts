import { Injectable } from '@angular/core';
import { iif } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NBPService {
  private listOfFavoriteCurrencies = ['EUR', 'USD'];

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
        { name: 'dolar australijski', code: 'AUD' },
        { name: 'euro', code: 'EUR' },
        { name: 'polski zloty', code: 'PL' },
        { name: 'awaluta', code: 'ADL' },
      ];
    return currenciesList;
  }

  getSortedAndGroupedCurrencyList() {
    let currenciesList = this.getCurrenciesList();
    let groupedCurrenciesList = this.groupCurrenciesList(currenciesList);
    let groupedAndSortedCurrenciesList = this.sortCurrenciesList(groupedCurrenciesList);
    return groupedAndSortedCurrenciesList;
  }

  groupCurrenciesList(currenciesList) {
    // add new property to object
    let groupedCurrenciesList = currenciesList.map(item => {
      // if currency code is in list of favorite currencies
      if(this.listOfFavoriteCurrencies.some( el => item.code === el)){
        item.groupCode = 'Favorite';
      } else {
        item.groupCode = item.name.charAt(0).toUpperCase();
      }
      return item;
    });
    return groupedCurrenciesList;
  }

  sortCurrenciesList(groupedCurrenciesList) {
    let groupedAndSortedCurrenciesList = groupedCurrenciesList.sort((a,b) => {
      if(a.groupCode === 'Favorite' && b.groupCode !== 'Favorite'){
        return -1;
      }
      if(a.groupCode !== 'Favorite' && b.groupCode === 'Favorite'){
        return 1;
      }
      return a.groupCode < b.groupCode ? -1 : a.groupCode > b.groupCode ? 1 : 0;
    });
    return groupedAndSortedCurrenciesList;
  }


}
