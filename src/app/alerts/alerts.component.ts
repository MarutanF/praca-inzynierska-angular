import { Component, OnInit } from '@angular/core';
import { FirebaseOptimalAlertsService, OptimalAlert } from '../services/firebase-optimal-alerts.service';
import { Currency, NBPCurrenciesService } from '../services/nbp-currencies.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})

export class AlertsComponent implements OnInit {

  // ALERTS
  public alert$;

  // CURRENCIES DROPDOWN
  public listOfCurrencies: Currency[] = [];
  public selectedCurrency: Currency;

  // DATAPICKER
  public selectedData;

  constructor(
    private optimalAlertService: FirebaseOptimalAlertsService,
    private currenciesService: NBPCurrenciesService) {
    this.alert$ = this.optimalAlertService.getUserAlerts();
  }

  async ngOnInit() {
    await this.initializeCurrenciesDropdown();
  }

  async initializeCurrenciesDropdown() {
    this.listOfCurrencies = await this.currenciesService.getCurrenciesList();
    this.selectedCurrency = this.listOfCurrencies[0];
  }

  deleteAlert(alert) {
    this.optimalAlertService.deleteAlert(alert);
  }

  myFun(data) {
    console.log('Alert click');
    console.log(data);
  }

  myFun2() {
    console.log('Button click');
  }

}
