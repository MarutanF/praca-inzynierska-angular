import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { delay, map } from 'rxjs/operators';
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
  private listOfFavoriteCurrencies = ['EUR', 'USD'];

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

  getCurrenciesList(): Observable<Currency[]> {

    // const currenciesList = getMockCurrencies();
    // return of(currenciesList).pipe(delay(500));

    let testList = [];
    this.http.get<any>(this.apiURL + 'exchangerates/tables/a/')
    .pipe(
        map((res: Response) => {
          return res[0].rates;
        }),
        delay(1))
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          testList.push({ code: data[i].code, name: data[i].currency })
        }
      });

    console.log('Result:');
    console.log(testList);

    return of(testList).pipe(
      delay(0),
      delay(0)
    );

  }

  getSortedAndGroupedCurrencyList(): Currency[] {
    let currenciesList = [];
    this.getCurrenciesList().subscribe(res => {
      currenciesList = res;
    });
    let groupedCurrenciesList = this.groupCurrenciesList(currenciesList);
    let groupedAndSortedCurrenciesList = this.sortCurrenciesList(groupedCurrenciesList);
    console.log(groupedAndSortedCurrenciesList);
    return groupedAndSortedCurrenciesList;
  }

  groupCurrenciesList(currenciesList): Currency[] {
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

  sortCurrenciesList(groupedCurrenciesList): Currency[] {
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
}

function getMockCurrencies() {
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
