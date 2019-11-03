import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';
import { NBPService } from '../services/nbp.service';
import { NBPCurrenciesService, Currency } from '../services/nbp-currencies.service';
import { PeriodService, Period } from '../services/period.service';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  // CURRENCIES DROPDOWN
  public listOfCurrencies: Currency[] = [];
  public selectedCurrency: Currency;
  public newestRate = 0.0;

  // RATES CHART 
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  public lineChartData: ChartDataSets[] = [
    { data: [1], label: 'SeriesA' }
  ];
  public lineChartLabels: Label[] = ['L1'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    annotation: {},
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  // PERIOD LIST
  public periodList: Period[] = [];
  public selectedPeriod: Period;

  constructor(
    private rateService: NBPService,
    private currenciesService: NBPCurrenciesService,
    private periodService: PeriodService) {
  }

  ngOnInit() {

    // PERIOD LIST 
    this.periodList = this.periodService.getPeriods();
    this.selectedPeriod = this.periodList[0];

    // CURRENCIES DROPDOWN
    this.currenciesService.getCurrenciesListHttp().subscribe(
      (value) => {
        console.log('Response - connection to NBP');
        this.listOfCurrencies = this.currenciesService.getCurrenciesListFormatted(value);
        console.log(this.listOfCurrencies);
        this.selectedCurrency = this.listOfCurrencies[0];
      },
      (error) => {
        console.log('Error - connection to NBP: ' + error);
        this.listOfCurrencies = this.currenciesService.getMockCurrencies();
        this.selectedCurrency = this.listOfCurrencies[0];
      }
    );

    // RATES CHART
    // let exchangeRates = this.rateService.getExchangeRates(this.selectedCurrency, this.selectedPeriod);
    let exchangeRates = this.rateService.getExchangeRates({ code: 'USD', name: 'dolar', table: 'a' }, this.selectedPeriod);
    this.lineChartData[0].data = exchangeRates.values;
    this.lineChartLabels = exchangeRates.dates;
    this.newestRate = exchangeRates.values[0];
    this.chart.update();

    // this.rateService.getCurrentRateHttp({code: 'CAD', name:'dolar', table:'a'}).subscribe(
    //   (value) => console.log(value)
    // );

    // console.log(this.periodService.getDatesArray({ label: '', id: 1 }));

    this.rateService.getRateHttp({ code: 'USD', name: 'dolar', table: 'a' }, '2017-10-01').subscribe(
      (value) => {
        console.log('value');
        console.log(value);
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    )

  }

  onSelectedCurrencyChange($event) {
    console.log({ name: '(currencyChange)', newValue: $event });
    let exchangeRates = this.rateService.getExchangeRates(this.selectedCurrency, this.selectedPeriod);
    this.lineChartData[0].data = exchangeRates.values;
    this.chart.update();
  }

  onSelectedPeriodChange(period) {
    console.log({ name: '(periodChange)', newValue: period });
    this.selectedPeriod = period;
  }

}
