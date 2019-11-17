import { Injectable } from '@angular/core';
import regression from 'regression';
import { Rate } from '../services/nbp-rates.service';

@Injectable({
  providedIn: 'root'
})
export class PredictService {

  constructor() {

  }

  dayToNumber(day: string): number {
    let date = new Date(day);
    let number = (date.getMonth() + 1) * 100 + date.getDate();
    return number;
  }

  createModel(arrayOfResponses: Array<Rate>) {
    let formattedData = [];
    arrayOfResponses.forEach((value) => {
      let xdate = this.dayToNumber(value.date);
      let yRate = value.rate;
      formattedData.push([xdate, yRate]);
    });
    let model = regression.linear(formattedData, { precision: 4, order: 2 });
    return model;
  }

  predict(model, day: string) {
    return model.predict(this.dayToNumber(day))[1];
  }

  test() {
    // should be y = 0,5 x + 0
    const result = regression.linear([[2, 4], [4, 8]]);
    return result;
  }

}
