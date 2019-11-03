import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface Currency {
  code: string;
  name: string;
  groupCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NBPService {
  apiURL: string = 'http://api.nbp.pl/api/';
  apiTableA: string = 'exchangerates/tables/a/';
  apiTableB: string = 'exchangerates/tables/b/';
  private listOfFavoriteCurrencies = ['EUR', 'USD', 'CHF', 'GBP'];

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

  getCurrenciesListHttp(): Observable<any> {
    let tableAResponse = this.http.get<any>(this.apiURL + this.apiTableA)
      .pipe(
        map((res: Response) => {
          return res[0].rates;
        }));
    let tableBResponse = this.http.get<any>(this.apiURL + this.apiTableB)
      .pipe(
        map((res: Response) => {
          return res[0].rates;
        }));
    return zip(tableAResponse, tableBResponse);
  }

  getCurrenciesListFormatted(data: Array<any>): Array<Currency> {
    let currenciesList: Array<Currency> = this.mapCurrenciesList(data);
    let groupedCurrenciesList: Array<Currency> = this.groupCurrenciesList(currenciesList);
    let groupedAndSortedCurrenciesList: Array<Currency> = this.sortCurrenciesList(groupedCurrenciesList);
    return groupedAndSortedCurrenciesList;
  }

  getSortedAndGroupedCurrencyList(): Array<Currency> {
    let currenciesList = this.getMockCurrencies();
    let groupedCurrenciesList = this.groupCurrenciesList(currenciesList);
    let groupedAndSortedCurrenciesList = this.sortCurrenciesList(groupedCurrenciesList);
    return groupedAndSortedCurrenciesList;
  }

  mapCurrenciesList(data: Array<any>): Array<Currency> {
    let mapedList = [];
    data = data[0].concat(data[1]); //flatmap because of zip in getCurrenciesListHttp
    for (let i = 0; i < data.length; i++) {
      mapedList.push({ code: data[i].code, name: data[i].currency })
    }
    return mapedList;
  }

  groupCurrenciesList(currenciesList: Array<Currency>): Array<Currency> {
    // add new property to object
    let groupedCurrenciesList = currenciesList.map(item => {
      // if currency code is in list of favorite currencies
      if (this.listOfFavoriteCurrencies.some(el => item.code === el)) {
        item.groupCode = 'Favorite';
      } else {
        item.groupCode = item.name.charAt(0).toUpperCase();
      }
      return item;
    });
    return groupedCurrenciesList;
  }

  sortCurrenciesList(groupedCurrenciesList: Array<Currency>): Array<Currency> {
    let groupedAndSortedCurrenciesList = groupedCurrenciesList.sort((a, b) => {
      if (a.groupCode === 'Favorite' && b.groupCode !== 'Favorite') {
        return -1;
      }
      if (a.groupCode !== 'Favorite' && b.groupCode === 'Favorite') {
        return 1;
      }
      return a.groupCode < b.groupCode ? -1 : a.groupCode > b.groupCode ? 1 : 0;
    });
    return groupedAndSortedCurrenciesList;
  }

  getMockCurrencies(): Array<Currency> {
    const currenciesList =
      [
        { name: 'dolar amerykański', code: 'USD' },
        { name: 'dolar australijski', code: 'AUD' },
        { name: 'euro', code: 'EUR' },
        { name: 'funt szterling', code: 'GBP' },
      ];
    return currenciesList;
  }
}

