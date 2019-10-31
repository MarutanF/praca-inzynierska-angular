import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import { NBPService } from '../services/nbp.service';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: this.rateService.getExchangeRates(1, 1, 1).values, label: 'Series A' }
  ];
  public lineChartLabels: Label[] = this.rateService.getExchangeRates(1, 1, 1).dates;
  public lineChartOptions: (ChartOptions & { annotation: any });
  public lineChartColors: Color[];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(private rateService: NBPService) { }

  ngOnInit() {
  }

}
