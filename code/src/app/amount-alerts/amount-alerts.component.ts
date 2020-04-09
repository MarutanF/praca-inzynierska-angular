import { Component, OnInit } from '@angular/core';
import { FirebaseOptimalAlertsService, OptimalAlert } from '../services/firebase-optimal-alerts.service';
import { Currency, NBPCurrenciesService } from '../services/nbp-currencies.service';
import { FirebaseAmountAlertsService } from '../services/firebase-amount-alerts.service';
@Component({
  selector: 'app-amount-alerts',
  templateUrl: './amount-alerts.component.html',
  styleUrls: ['./amount-alerts.component.css']
})
export class AmountAlertsComponent implements OnInit {

  // ALERTS
  public alert$;

  // CURRENCIES DROPDOWN
  public listOfCurrencies: Currency[] = [];
  public selectedCurrency: Currency;

  // DATAPICKER
  public selectedData;
  public defaultDate;

  public defaultAmount = 1.0;
  public amount: number = this.defaultAmount;

  constructor(
    private amountAlertService: FirebaseAmountAlertsService,
    private currenciesService: NBPCurrenciesService) {
    this.alert$ = this.amountAlertService.getUserAlerts();
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
    this.amountAlertService.deleteAlert(alert);
  }

  addAlert() {
    let currencyCode = this.selectedCurrency.code;
    let expireDate = new Date(this.selectedData.year, this.selectedData.month, this.selectedData.day);
    let amountNumber = this.amount <= 0 ? this.defaultAmount : this.amount;
    this.amountAlertService.addAlert({ currencyCode: currencyCode, expireDate: expireDate, amount: amountNumber });
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
    this.amount = this.defaultAmount;
  }

}
