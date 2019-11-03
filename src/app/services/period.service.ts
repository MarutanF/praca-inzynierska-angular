import { Injectable } from '@angular/core';

export interface Period {
  label: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private periodList: Array<Period> = [];
  private lastAvailableDate: string = '2001-01-02';

  constructor() {
    this.periodList =
      [
        { label: '1 tyg', id: 0 },
        { label: '1 mies', id: 1 },
        { label: '6 mies', id: 2 },
        { label: '1 rok', id: 3 },
        { label: '5 lat', id: 4 },
        { label: 'max', id: 5 }
      ];
  }

  getPeriods(): Array<Period> {
    return this.periodList;
  }

  getEndDate() {
    let stopDate = new Date().toISOString().slice(0, 10);
    return stopDate;
  }

  getStartDate(period: Period) {
    let actualDate: Date = new Date();
    let stopDate: Date = new Date();
    switch (period.id) {
      case 0: {
        stopDate.setDate(actualDate.getDate() - 7);
        break;
      }
      case 1: {
        stopDate.setMonth(actualDate.getMonth() - 1);
        break;
      }
      case 2: {
        stopDate.setMonth(actualDate.getMonth() - 6);
        break;
      }
      case 3: {
        stopDate.setFullYear(actualDate.getFullYear() - 1);
        break;
      }
      case 4: {
        stopDate.setFullYear(actualDate.getFullYear() - 5);
        break;
      }
      case 5: {
        stopDate = new Date(this.lastAvailableDate);
        break;
      }
    }
    return stopDate.toISOString().slice(0, 10);
  }

  getDatesArray(period: Period): Array<string> {
    let dateArray:Array<string> = [];
    let startDate = this.getStartDate(period);
    let endDate = this.getEndDate();
    let dateMove = new Date(startDate);
    let strDate = startDate;

    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);
      dateArray.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    };

    return dateArray;
  }
}
