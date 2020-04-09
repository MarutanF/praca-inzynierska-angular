import { Component, OnInit } from '@angular/core';
import { NBPRatesService, Rate } from '../services/nbp-rates.service';
import { NBPCurrenciesService, Currency } from '../services/nbp-currencies.service';
import { NBPCalculatorService } from '../services/nbp-calculator.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  public isNBPServerAvailable: boolean = true;

  public listOfCurrencies: Currency[] = [];
  public conversionRatio: number = 1;

  public amountHave: number = 1;
  public selectedCurrencyHave: Currency;
  public amountWant: number = 1;
  public selectedCurrencyWant: Currency;

  constructor(
    private rateService: NBPRatesService,
    private currenciesService: NBPCurrenciesService,
    private calculatorService: NBPCalculatorService
  ) { }

  async ngOnInit() {
    this.checkNBPServer();
    await this.initializeCurrenciesDropdowns();
    this.updateHave2Want();
  }

  async checkNBPServer(){
    this.rateService.checkNBPStatus().then(value => this.isNBPServerAvailable = value);
  }

  async initializeCurrenciesDropdowns() {
    this.listOfCurrencies = await this.currenciesService.getCurrenciesList();
    this.listOfCurrencies = this.currenciesService.addPLNCurrency(this.listOfCurrencies);
    this.selectedCurrencyHave = this.listOfCurrencies[0];
    this.selectedCurrencyWant = this.listOfCurrencies[1];
  }

  onSelectedCurrencyChangeHave($event) {
    console.log({ name: '(currencyChange)', newValue: JSON.stringify($event) });
    this.selectedCurrencyHave = $event;
    this.updateHave2Want();
  }

  onSelectedCurrencyChangeWant($event) {
    console.log({ name: '(currencyChange)', newValue: JSON.stringify($event) });
    this.selectedCurrencyWant = $event;
    this.updateWant2Have();
  }

  onChangedAmountHave() {
    console.log({ name: '(onChangedAmountHave)', newValue: JSON.stringify(this.amountHave) });
    this.updateHave2Want();
  }

  onChangedAmountWant() {
    console.log({ name: '(onChangedAmountWant)', newValue: JSON.stringify(this.amountWant) });
    this.updateWant2Have();
  }

  updateHave2Want() {
    this.calculatorService.convertRate(this.selectedCurrencyHave, this.selectedCurrencyWant).subscribe(
      (value) => {
        this.conversionRatio = value;
        this.amountHave = Number(this.amountHave);
        this.amountWant = Number((this.amountHave * value).toFixed(2));
      }
    );
  }

  updateWant2Have() {
    this.calculatorService.convertRate(this.selectedCurrencyWant, this.selectedCurrencyHave).subscribe(
      (value) => {
        this.conversionRatio = value;
        this.amountHave = Number((this.amountWant * value).toFixed(2));
        this.amountWant = Number(this.amountWant);
      }
    );
  }
}
