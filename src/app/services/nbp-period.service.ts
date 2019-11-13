import { Injectable } from '@angular/core';

export interface Period {
  label: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NBPPeriodService {
  private periodList: Array<Period> = [];
  public lastAvailableDate = '2001-01-02';

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

  getPeriodsList(): Array<Period> {
    return this.periodList;
  }

  getEndDate() {
    const stopDate = new Date().toISOString().slice(0, 10);
    return stopDate;
  }

  getStartDate(period: Period) {
    const actualDate: Date = new Date();
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

  getStopDateForecast(period: Period) {
    const actualDate: Date = new Date();
    let stopDate: Date = new Date();
    switch (period.id) {
      case 0:
      case 1: {
        stopDate.setDate(actualDate.getDate() + 1);
        break;
      }
      case 2:
      case 3: {
        stopDate.setMonth(actualDate.getMonth() + 1);
        break;
      }
      case 4:
      case 5: {
        stopDate.setFullYear(actualDate.getFullYear() + 1);
        break;
      }
    }
    return stopDate.toISOString().slice(0, 10);
  }

  getDatesBetween(start: string, stop: string): Array<string> {
    const dateArray: Array<string> = [];
    const dateMove = new Date(start);
    dateMove.setDate(dateMove.getDate() + 1);
    let strDate = start;
    while (strDate <= stop) {
      strDate = dateMove.toISOString().slice(0, 10);
      dateArray.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    }
    return dateArray;
  }

  getDatesArray(period: Period): Array<string> {
    const dateArray: Array<string> = [];
    const startDate = this.getStartDate(period);
    const endDate = this.getEndDate();
    const dateMove = new Date(startDate);
    let strDate = startDate;

    while (strDate < endDate) {
      strDate = dateMove.toISOString().slice(0, 10);
      dateArray.push(strDate);
      dateMove.setDate(dateMove.getDate() + 1);
    }

    return dateArray;
  }

  minusOneDay(day0: string): string {
    let day1 = new Date(day0);
    day1.setDate(day1.getDate() - 1);
    return day1.toISOString().slice(0, 10);
  }

  plusOneDay(day0: string): string {
    let day1 = new Date(day0);
    day1.setDate(day1.getDate() + 1);
    return day1.toISOString().slice(0, 10);
  }







}
