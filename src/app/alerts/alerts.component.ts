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
  public defaultDate;

  constructor(
    private optimalAlertService: FirebaseOptimalAlertsService,
    private currenciesService: NBPCurrenciesService) {
    this.alert$ = this.optimalAlertService.getUserAlerts();
    this.defaultDate = this.getDefaultDate();
    this.selectedData = this.defaultDate;
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

  addAlert() {
    let currencyCode = this.selectedCurrency.code;
    let expireDate = new Date(this.selectedData.year, this.selectedData.month, this.selectedData.day);
    this.optimalAlertService.addAlert({ currencyCode: currencyCode, expireDate: expireDate });
    this.resetForm();
  }

  getMinDate() {
    let today = new Date();
    let todayObj = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    return todayObj;
  }

  getDefaultDate() {
    let today = new Date();
    today.setDate(today.getDate() + 7);
    let todayObj = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    return todayObj;
  }

  resetForm() {
    this.selectedCurrency = this.listOfCurrencies[0];
    this.selectedData = this.defaultDate;
  }

}
