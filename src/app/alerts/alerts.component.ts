import { Component, OnInit } from '@angular/core';
import { FirebaseOptimalAlertsService, OptimalAlert } from '../services/firebase-optimal-alerts.service';
import { Currency, NBPCurrenciesService } from '../services/nbp-currencies.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})

export class AlertsComponent implements OnInit {

  ngOnInit() {  }

}
