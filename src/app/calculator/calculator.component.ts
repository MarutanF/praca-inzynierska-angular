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

  public listOfCurrencies: Currency[] = [];
  public amountHave: number = 1;
  public selectedCurrencyHave: Currency;
  public amountWant: number = 1;
  public selectedCurrencyWant: Currency;

  public text1 = 'a';
  public text2 = 'b';
  public text3 = 'c';
  public text4 = '';

  constructor(
    private rateService: NBPRatesService,
    private currenciesService: NBPCurrenciesService,
    private calculatorService: NBPCalculatorService
  ) { }

  ngOnInit() {
    // CURRENCIES DROPDOWN
    this.listOfCurrencies = this.currenciesService.getMockCurrencies();
    this.selectedCurrencyHave = this.listOfCurrencies[0];
    this.selectedCurrencyWant = this.listOfCurrencies[1];
    this.currenciesService.getCurrenciesListHttp().subscribe(
      (value) => {
        console.log('Response - connection to NBP with currencies: ');
        this.listOfCurrencies = this.currenciesService.getCurrenciesListFormatted(value);
        this.listOfCurrencies = this.calculatorService.getCurrenciesListFormattedForCalculator(this.listOfCurrencies);
        this.selectedCurrencyHave = this.listOfCurrencies[0];
        this.selectedCurrencyWant = this.listOfCurrencies[1];
        this.updateHave2Want();
      },
      (error) => {
        // mock currencies will be displayed
        console.log('Error - connection to NBP with currencies: ' + error);
      }
    );
  }

  onSelectedCurrencyChangeHave($event) {
    console.log({ name: '(currencyChange)', newValue: $event });
    this.selectedCurrencyHave = $event;
    this.updateHave2Want();
  }

  onSelectedCurrencyChangeWant($event) {
    console.log({ name: '(currencyChange)', newValue: $event });
    this.selectedCurrencyWant = $event;
    this.updateWant2Have();
  }

  onChangedAmountHave() {
    console.log({ name: '(onChangedAmountHave)', newValue: this.amountHave });
    this.updateHave2Want();
  }

  onChangedAmountWant() {
    console.log({ name: '(onChangedAmountWant)', newValue: this.amountWant });
    this.updateWant2Have();
  }

  updateHave2Want(){
    this.calculatorService.convertRate(this.selectedCurrencyHave, this.selectedCurrencyWant).subscribe(
      (value) => {
        this.amountHave = Number(this.amountHave);
        this.amountWant = Number((this.amountHave * value).toFixed(2));
        this.text1 = `${this.amountHave} ${this.selectedCurrencyHave.code} = ${this.amountWant} ${this.selectedCurrencyWant.code}`;
        this.text2 = `1 ${this.selectedCurrencyHave.code} = ${Number((value).toFixed(2))} ${this.selectedCurrencyWant.code}`;
        this.text3 = `${(Number((1/value).toFixed(2)))} ${this.selectedCurrencyHave.code} = 1 ${this.selectedCurrencyWant.code}`;
      }
    );
  }

  updateWant2Have(){
    this.calculatorService.convertRate(this.selectedCurrencyWant, this.selectedCurrencyHave).subscribe(
      (value) => {
        this.amountHave = Number((this.amountWant * value).toFixed(2));
        this.amountWant = Number(this.amountWant);
        this.text1 = `${this.amountHave} ${this.selectedCurrencyHave.code} = ${this.amountWant} ${this.selectedCurrencyWant.code}`;
        this.text2 = `1 ${this.selectedCurrencyHave.code} = ${Number((value).toFixed(2))} ${this.selectedCurrencyWant.code}`;
        this.text3 = `${(Number((1/value).toFixed(2)))} ${this.selectedCurrencyHave.code} = 1 ${this.selectedCurrencyWant.code}`;
      }
    );
  }

}
