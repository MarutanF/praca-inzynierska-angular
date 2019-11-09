import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, zip, of } from 'rxjs';
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
  private listOfFavoriteCurrencies = ['EUR', 'USD', 'CHF', 'GBP', 'PLN'];

  constructor(private http: HttpClient) { }

  getCurrenciesList(): Promise<Currency[]> {
    return this.getCurrenciesListHttp().toPromise()
      .then(
        (value) => {
          let listOfCurrencies: Currency[] = this.mergeHttpResponse(value);
          listOfCurrencies = this.groupCurrenciesList(listOfCurrencies);
          listOfCurrencies = this.sortCurrenciesList(listOfCurrencies);
          console.log('Response - connection to NBP with currencies: ');
          console.log(listOfCurrencies);
          return listOfCurrencies;
        })
      .catch(
        (error) => {
          console.log('Error - connection to NBP with currencies: ' + error);
          let listOfCurrencies: Currency[] = this.getMockCurrencies();
          listOfCurrencies = this.groupCurrenciesList(listOfCurrencies);
          listOfCurrencies = this.sortCurrenciesList(listOfCurrencies);
          return listOfCurrencies;
        }
      );
  }

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

  mergeHttpResponse(data: Array<any>): Array<Currency> {
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

  addPLNCurrency(currenciesList: Array<Currency>): Array<Currency>{
    const plnCurrency: Currency = {
      code: 'PLN',
      name: 'polski złoty',
      groupCode: 'Favorite'
    };
    currenciesList.unshift(plnCurrency); //add at [0]
    return currenciesList;
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
