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

  public text1: string = "a";
  public text2: string = "b";
  public text3: string = "c";
  public text4: string = "d";

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
        this.selectedCurrencyHave = this.listOfCurrencies[1];
        this.selectedCurrencyWant = this.listOfCurrencies[2];

        this.calculatorService.convertRate(this.selectedCurrencyHave, this.selectedCurrencyWant).subscribe(
          (value) => {
            this.amountHave = 1;
            this.amountWant = 1 * value;
          }
        );

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
  }

  onSelectedCurrencyChangeWant($event) {
    console.log({ name: '(currencyChange)', newValue: $event });
    this.selectedCurrencyWant = $event;
  }

  onChangedAmountHave() {
    console.log({ name: '(onChangedAmountHave)', newValue: this.amountHave });
  }

  onChangedAmountWant() {
    console.log({ name: '(onChangedAmountWant)', newValue: this.amountWant });
  }


}
