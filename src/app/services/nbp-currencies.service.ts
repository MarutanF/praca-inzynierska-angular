import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Currency {
  code: string;
  name: string;
  table?: string;
  groupCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NBPCurrenciesService {
  apiURL = 'http://api.nbp.pl/api/';
  apiTableA = 'exchangerates/tables/a/';
  apiTableB = 'exchangerates/tables/b/';
  private listOfFavoriteCurrencies = ['EUR', 'USD', 'CHF', 'GBP'];

  constructor(private http: HttpClient) { }

  getCurrenciesListHttp(): Observable<any> {
    const tableAResponse = this.http.get<any>(this.apiURL + this.apiTableA)
      .pipe(
        map((res) => {
          return res[0].rates;
        }));
    const tableBResponse = this.http.get<any>(this.apiURL + this.apiTableB)
      .pipe(
        map((res) => {
          return res[0].rates;
        }));
    return zip(tableAResponse, tableBResponse);
  }

  getCurrenciesListFormatted(res: Array<any>): Array<Currency> {
    const currenciesList: Array<Currency> = this.mapCurrenciesList(res);
    const groupedCurrenciesList: Array<Currency> = this.groupCurrenciesList(currenciesList);
    const groupedAndSortedCurrenciesList: Array<Currency> = this.sortCurrenciesList(groupedCurrenciesList);
    return groupedAndSortedCurrenciesList;
  }

  mapCurrenciesList(data: Array<any>): Array<Currency> {
    const mapedList = [];
    for (let i = 0; i < data[0].length; i++) {
      mapedList.push({ code: data[0][i].code, name: data[0][i].currency, table: 'a' });
    }
    for (let i = 0; i < data[1].length; i++) {
      mapedList.push({ code: data[1][i].code, name: data[1][i].currency, table: 'b' });
    }
    return mapedList;
  }

  groupCurrenciesList(currenciesList: Array<Currency>): Array<Currency> {
    // add new property to object
    const groupedCurrenciesList = currenciesList.map(item => {
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
    const groupedAndSortedCurrenciesList = groupedCurrenciesList.sort((a, b) => {
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
        { name: 'dolar amerykański', code: 'USD', table: 'a' },
        { name: 'dolar australijski', code: 'AUD', table: 'a' },
        { name: 'euro', code: 'EUR', table: 'a' },
        { name: 'funt szterling', code: 'GBP', table: 'a' },
      ];
    return currenciesList;
  }
}
