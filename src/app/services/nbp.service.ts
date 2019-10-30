import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NBPService {

  constructor() { }

  getData(code, startDate, endDate) {
    const obj = {
      dates: ['2019-10-02', '2019-10-03', '2019-10-04'],
      values: [4.0152, 3.9652, 3.9469]
    };
    return obj;
  }
}
