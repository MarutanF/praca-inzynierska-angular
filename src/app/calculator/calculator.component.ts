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
  public amountHave: Number = 1;
  public selectedCurrencyHave: Currency;
  public amountWant: Number = 1;
  public selectedCurrencyWant: Currency;

  constructor(
    private rateService: NBPRatesService,
    private currenciesService: NBPCurrenciesService,
    private calculatorService: NBPCalculatorService
  ) { }

  ngOnInit() {
    // CURRENCIES DROPDOWN
    this.listOfCurrencies = this.currenciesService.getMockCurrencies();
    this.selectedCurrencyHave = this.listOfCurrencies[0];
    this.selectedCurrencyWant = this.listOfCurrencies[0];
    this.currenciesService.getCurrenciesListHttp().subscribe(
      (value) => {
        console.log('Response - connection to NBP with currencies: ');
        this.listOfCurrencies = this.currenciesService.getCurrenciesListFormatted(value);
        this.listOfCurrencies = this.calculatorService.getCurrenciesListFormattedForCalculator(this.listOfCurrencies);
        this.selectedCurrencyHave = this.listOfCurrencies[0];
        this.selectedCurrencyWant = this.listOfCurrencies[1];
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
    console.log(this.amountHave);
  }

  onSelectedCurrencyChangeWant($event) {
    console.log({ name: '(currencyChange)', newValue: $event });
    this.selectedCurrencyWant = $event;
  }

  onChangedAmountHave(){
    console.log({ name: '(onChangedAmountHave)', newValue: 1 });
  }
}
