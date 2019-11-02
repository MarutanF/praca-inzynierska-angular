import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { NBPService, Currency } from '../services/nbp.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  // CHART
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

  // CURRENCIES
  public listOfCurrencies: Observable<Currency[]>;
  public selectedCurrency = {};
  public newestRate = 0.0;

  // PERIOD LIST
  public periodList = [
    '1 tyg',
    '1 mies',
    '6 mies',
    '1 rok',
    '5 lat',
    'max'
  ];
  public selectedPeriod = this.periodList[0];

  constructor(private rateService: NBPService) {
  }

  ngOnInit() {
    // DATA FOR CHART
    let exchangeRates = this.rateService.getExchangeRates('USD', 1, 1);
    this.lineChartData[0].data = exchangeRates.values;
    this.lineChartLabels = exchangeRates.dates;
    this.chart.update();

    // DROPDOWN
    this.listOfCurrencies = this.rateService.getCurrenciesList();
    this.selectedCurrency = this.listOfCurrencies[0];
    this.newestRate = exchangeRates.values[0];
  }

  onSelectedCurrencyChange($event) {
    console.log({ name: '(change)', value: $event });
  }

  onSelectedPerion(period) {
    this.selectedPeriod = period;
  }

}
