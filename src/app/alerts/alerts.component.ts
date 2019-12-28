import { Component, OnInit } from '@angular/core';

import { FirebaseOptimalAlertsService, OptimalAlert } from '../services/firebase-optimal-alerts.service';
import { Currency, NBPCurrenciesService } from '../services/nbp-currencies.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})

export class AlertsComponent implements OnInit {

  public isFirebaseServerAvailable: boolean = true;

  constructor(private firebaseService: FirebaseService){}

  ngOnInit() {
    this.checkFirebaseServer();
  }

  async checkFirebaseServer(){
    this.firebaseService.checkFirebaseStatus().then((value) => this.isFirebaseServerAvailable = value);
  }

}
