import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, BaseChartDirective, ChartsModule } from 'ng2-charts';
import { NBPRatesService, Rate } from '../services/nbp-rates.service';
import { NBPCurrenciesService, Currency } from '../services/nbp-currencies.service';
import { NBPPeriodService, Period } from '../services/nbp-period.service';

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
    { data: [], label: 'Kurs historyczny' },
    { data: [], label: 'Kurs sredni', borderDash: [5, 5], pointStyle: 'line' },
    { data: [], label: 'Kurs przewidywany', borderDash: [5, 5], pointStyle: 'line' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    annotation: {},
    legend: { position: 'right' }
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(248,249,250,0.5)',
      borderColor: 'rgba(128,128,128,1)',
      pointBackgroundColor: 'rgba(128,128,128,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(255,255,255, 0)',
      borderColor: 'rgba(0,68,137,1)',
    },
    {
      backgroundColor: 'rgba(248,249,250,0.5)',
      borderColor: 'rgba(208,208,208,1)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  // PERIOD LIST
  public periodList: Period[] = [];
  public selectedPeriod: Period;

  constructor(
    private rateService: NBPRatesService,
    private currenciesService: NBPCurrenciesService,
    private periodService: NBPPeriodService) {
  }

  ngOnInit() {

    // PERIOD LIST
    this.periodList = this.periodService.getPeriods();
    this.selectedPeriod = this.periodList[0];

    // CURRENCIES DROPDOWN
    this.listOfCurrencies = this.currenciesService.getMockCurrencies();
    this.selectedCurrency = this.listOfCurrencies[0];
    console.log(this.selectedCurrency);
    this.currenciesService.getCurrenciesListHttp().subscribe(
      (value) => {
        console.log('Response - connection to NBP with currencies: ');
        this.listOfCurrencies = this.currenciesService.getCurrenciesListFormatted(value);
        console.log(this.listOfCurrencies);
        this.selectedCurrency = this.listOfCurrencies[0];
        console.log(this.selectedCurrency);
      },
      (error) => {
        // mock currencies will be displayed
        console.log('Error - connection to NBP with currencies: ' + error);
      }
    );

    // RATES CHART
    this.updateChartWithData();
  }

  onSelectedCurrencyChange($event) {
    console.log({ name: '(currencyChange)', newValue: $event });
    this.selectedCurrency = $event;
    this.updateChartWithData();
  }

  onSelectedPeriodChange(period) {
    console.log({ name: '(periodChange)', newValue: period });
    this.selectedPeriod = period;
    this.updateChartWithData();
  }

  updateChartWithData() {
    let collectionOfResponses: Array<Rate> = [];
    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];
    this.lineChartData[2].data = [];
    this.rateService.getRatesArrayHttp(this.selectedCurrency, this.selectedPeriod).subscribe(
      (value) => {
        collectionOfResponses.push(value);
      },
      (error) => {
        // mock rates will be displayed
        console.log('Error - connection to NBP with rates: ' + error);
        const mockRatesArray = this.rateService.getMockRatesArray(this.selectedCurrency, this.selectedPeriod);
        this.lineChartData[0].data = mockRatesArray.values;
        this.lineChartLabels = mockRatesArray.dates;
        this.newestRate = mockRatesArray.values[0];
        this.chart.update();
      },
      () => {
        console.log('Response - connection to NBP with rates: ');
        console.log(collectionOfResponses);
        collectionOfResponses.sort((a, b) => (a.date).localeCompare(b.date));
        this.lineChartLabels = collectionOfResponses.map((value) => value.date);
        collectionOfResponses = collectionOfResponses.filter(value => value.valid === true);
        this.lineChartData[0].data = collectionOfResponses.map((value) => {
          return {
            y: value.rate, x: value.date
          };
        });
        this.newestRate = collectionOfResponses.slice(-1)[0].rate;
        this.updateChartForecast(collectionOfResponses);
        this.updateChartAverage(collectionOfResponses);
        this.chart.update();
      }
    );
  }

  updateChartAverage(collectionOfResponses: Array<Rate>) {
    const averageValue = collectionOfResponses.map((value) => value.rate).reduce((a, b) => a + b, 0) / collectionOfResponses.length;
    this.lineChartData[1].data = [
      {x: String(this.lineChartLabels[0]), y: averageValue},
      {x: String(this.lineChartLabels.slice(-1)[0]), y: averageValue}
    ];
    console.log(String(this.lineChartLabels[0]));

  }

  updateChartForecast(collectionOfResponses: Array<Rate>) {
    let startData = String(this.lineChartLabels.slice(-1)[0]);
    let stopData = this.periodService.getStopDateForecast(this.selectedPeriod);
    let arrayOfDates = this.periodService.getDatesBetween(startData, stopData);
    arrayOfDates.forEach((value) => {
      this.lineChartLabels.push(value);
    })
    this.lineChartData[2].data = [
      {x: startData, y: collectionOfResponses.slice(-1)[0].rate},
      {x: stopData, y: collectionOfResponses.slice(-1)[0].rate}
    ];
  }


}
