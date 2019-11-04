import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';
import { NBPService, Rate } from '../services/nbp.service';
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
    { data: [1, 2, 3], label: 'Rate' }
  ];
  public lineChartLabels: Label[] = ['L1', 'L2', 'L3'];
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
    this.listOfCurrencies = this.currenciesService.getMockCurrencies();
    this.selectedCurrency = this.listOfCurrencies[0];
    this.currenciesService.getCurrenciesListHttp().subscribe(
      (value) => {
        console.log('Response - connection to NBP with currencies: ');
        this.listOfCurrencies = this.currenciesService.getCurrenciesListFormatted(value);
        console.log(this.listOfCurrencies);
        this.selectedCurrency = this.listOfCurrencies[0];
      },
      (error) => {
        console.log('Error - connection to NBP with currencies: ' + error); // mock currencies will be displayed
      }
    );

    // TEST VARIABLES
    const testCurrency = { code: 'USD', name: 'dolar', table: 'a' };
    const testPeriod = { label: '', id: 0 };

    // RATES CHART
    // TEST OF nbp-rates
    const collectionOfResponses: Array<Rate> = [];
    this.rateService.getRatesArrayHttp(this.selectedCurrency, this.selectedPeriod).subscribe(
      (value) => {
        collectionOfResponses.push(value);
      },
      (error) => {
        console.log('Error - connection to NBP with rates: ' + error);
        const mockRatesArray = this.rateService.getMockRatesArray(this.selectedCurrency, this.selectedPeriod);
        console.log(mockRatesArray);
        this.lineChartData[0].data = mockRatesArray.values;
        this.lineChartLabels = mockRatesArray.dates;
        this.newestRate = mockRatesArray.values[0];
        this.chart.update();
      },
      () => {
        console.log('Response - connection to NBP with rates: ');
        console.log(collectionOfResponses);
        collectionOfResponses.sort((a, b) => (a.date).localeCompare(b.date));
        this.lineChartData[0].data = collectionOfResponses.map((value) => value.rate);
        this.lineChartLabels = collectionOfResponses.map((value) => value.date);
        this.newestRate = this.lineChartData[0].data[0];
        this.chart.update();
      }
    );
  }

  onSelectedCurrencyChange($event) {
    console.log({ name: '(currencyChange)', newValue: $event });
    // removeData(this.chart);
    const mockRatesArray = this.rateService.getMockRatesArray(this.selectedCurrency, this.selectedPeriod);
    console.log(mockRatesArray);
    this.lineChartData[0].data = mockRatesArray.values;
    this.lineChartLabels = mockRatesArray.dates;
    this.newestRate = mockRatesArray.values[0];
    this.chart.update();
  }

  onSelectedPeriodChange(period) {
    console.log({ name: '(periodChange)', newValue: period });
    this.selectedPeriod = period;
  }
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}
