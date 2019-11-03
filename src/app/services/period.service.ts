import { Injectable } from '@angular/core';

export interface Period {
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  constructor() { }

  getPeriods(): Array<Period> {
    const periodList =
      [
        { label: '1 tyg' },
        { label: '1 mies' },
        { label: '6 mies' },
        { label: '1 rok' },
        { label: '5 lat' },
        { label: 'max' }
      ];
    return periodList;
  }

}
