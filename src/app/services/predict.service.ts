// https://angularfirebase.com/lessons/tensorflow-js-quick-start/

import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root'
})
export class PredictService {

  public linearModel: tf.Sequential;
  public prediction: any;

  constructor() {

  }

  async train(): Promise<any> {
    // Define a model for linear regression.
    this.linearModel = tf.sequential();
    this.linearModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // Prepare the model for training: Specify the loss and the optimizer.
    this.linearModel.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });


    // Training data, completely random stuff
    const xs = tf.tensor1d([2.0, 4.0, 8.0]);
    const ys = tf.tensor1d([1.0, 2.0, 4.0]);


    // Train
    await this.linearModel.fit(xs, ys);

    console.log('model trained!');
  }

  predict(valX: number) {
    const output = this.linearModel.predict(tf.tensor2d([valX], [1, 1])) as any;
    this.prediction = Array.from(output.dataSync())[0];
    const valY = this.prediction;
    return valY;
  }
}
