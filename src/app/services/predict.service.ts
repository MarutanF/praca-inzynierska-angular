import { Injectable } from '@angular/core';
import regression from 'regression';

@Injectable({
  providedIn: 'root'
})
export class PredictService {

  constructor() {

  }

  testFun() {
    const result = regression.linear([[2, 1], [4, 2], [16, 8]]);
    return result;
  }

}
