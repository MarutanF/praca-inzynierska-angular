import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { Currency, NBPCurrenciesService } from '../services/nbp-currencies.service';
import { NBPPeriodService, Period } from '../services/nbp-period.service';
import { NBPRatesService, Rate } from '../services/nbp-rates.service';
import { PredictService } from '../services/predict.service';

export interface Point {
  y: number;
  x: string;
}

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
  @ViewChild(BaseChartDirective, { static: true })
  chart: BaseChartDirective;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Kurs historyczny' },
    { data: [], label: 'Kurs sredni', borderDash: [5, 5], pointStyle: 'line' },
    { data: [], label: 'Kurs przewidywany', borderDash: [5, 5], pointStyle: 'line' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    maintainAspectRatio: false,
    responsive: true,
    annotation: {},
    legend: { position: 'right' },
    tooltips: {
      mode: 'x',
      intersect: false,
      callbacks: {
        title: function (tooltipItem, data) {
          let day = ((data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index] as Point).x);
          return day;
        },
        label: function (tooltipItem, data) {
          let day = ((data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] as Point).x);
          let value = Number(tooltipItem.value).toFixed(4);
          let datasetName = (data.datasets[tooltipItem.datasetIndex].label).substring(5);
          return ' Kurs ' + value + ' (' + datasetName + ')' + ' dnia: ' + day;
        }
      }
    },
    hover: {
      mode: 'x',
      intersect: false
    },
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

  // DATA
  private arrayOfResponses: Array<Rate> = [];
  private arrayOfDates: Array<string> = [];

  constructor(
    private rateService: NBPRatesService,
    private currenciesService: NBPCurrenciesService,
    private periodService: NBPPeriodService,
    private predictService: PredictService) {
  }

  async ngOnInit() {
    this.initializePeriodList();
    await this.initializeCurrenciesDropdown();
    this.updateCharts();
  }

  initializePeriodList() {
    this.periodList = this.periodService.getPeriodsList();
    this.selectedPeriod = this.periodList[0];
  }

  async initializeCurrenciesDropdown() {
    this.listOfCurrencies = await this.currenciesService.getCurrenciesList();
    this.selectedCurrency = this.listOfCurrencies[0];
    this.newestRate = await this.rateService.getCurrentRatePromise(this.selectedCurrency);
  }

  onSelectedCurrencyChange($event) {
    console.log({ name: '(currencyChange)', newValue: JSON.stringify($event) });
    this.selectedCurrency = $event;
    this.rateService.getCurrentRatePromise(this.selectedCurrency).then((val) => this.newestRate = val);
    this.updateCharts();
  }

  onSelectedPeriodChange(period) {
    console.log({ name: '(periodChange)', newValue: JSON.stringify(period) });
    this.selectedPeriod = period;
    this.updateCharts();
  }

  updateCharts() {
    this.arrayOfResponses = [];
    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];
    this.lineChartData[2].data = [];
    this.arrayOfDates = this.periodService.getDatesArray(this.selectedPeriod);
    this.lineChartLabels = this.arrayOfDates;
    this.rateService.getRatesArrayHttp(this.selectedCurrency, this.arrayOfDates).subscribe(
      (value) => {
        this.arrayOfResponses.push(value);
        (this.lineChartData[0].data as Array<Point>).push({ y: value.rate, x: value.date });
      },
      (error) => { },
      () => {
        console.log('Response - connection to NBP with rates: ');
        console.log(this.arrayOfResponses);
        // console.log(this.lineChartData[0].data);
        // console.log(this.lineChartLabels);

        this.addValueToFirstDate();
        this.updateChartAverage();
        this.updateChartForecast();
      }
    );
  }

  async addValueToFirstDate() {
    if (this.lineChartLabels[0] !== (this.lineChartData[0].data as Array<Point>)[0].x) {
      const lastAvailableRate = await this.rateService.getRateForDayOrLastAvailableDay(this.selectedCurrency, (this.lineChartLabels[0] as string));
      (this.lineChartData[0].data as Array<Point>).unshift({ y: lastAvailableRate.rate, x: (this.lineChartLabels[0] as string) });
    }
  }

  updateChartAverage() {
    const averageValue = this.arrayOfResponses.map((value) => value.rate).reduce((a, b) => a + b, 0) / this.arrayOfResponses.length;
    this.lineChartData[1].data = [
      { x: String(this.lineChartLabels[0]), y: averageValue },
      { x: String(this.arrayOfResponses.slice(-1)[0].date), y: averageValue }
    ];
  }

  updateChartForecast() {
    // add last point in history to chart
    const lastPointInHistory: Point = { x: String(this.arrayOfResponses.slice(-1)[0].date), y: this.arrayOfResponses.slice(-1)[0].rate };
    (this.lineChartData[2].data as Array<Point>).push(lastPointInHistory);

    // startData = lastPoint + 1
    const startData = this.periodService.plusOneDay(lastPointInHistory.x);
    const stopData = this.periodService.getStopDateForecast(this.selectedPeriod);
    const arrayOfFutureDays = this.periodService.getDatesBetween(startData, stopData);

    // console.log('start: ' + startData);
    // console.log('stop: ' + stopData);
    // console.log(arrayOfFutureDays);

    let model = this.predictService.createModel(this.arrayOfResponses);
    arrayOfFutureDays.forEach((day) => {
      if (this.lineChartLabels.includes(day)) {
        // data zostala dodana do label wczesniej, wiec nie dodaje ponownie
        // data zostala dodana wczesniej bo ten dzien juz minal, wiec predykcja to ostatnia wartosc
        (this.lineChartData[2].data as Array<Point>).push({ y: lastPointInHistory.y, x: day });
      } else {
        this.lineChartLabels.push(day);
        (this.lineChartData[2].data as Array<Point>).push({ y: this.predictService.predict(model, day), x: day });
      }
    });
  }
}
