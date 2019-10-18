import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [1, 2, 3], label: 'Series A' }
  ];
  public lineChartLabels: Label[] = ['Label1', 'Label2', 'Label3'];
  public lineChartOptions: (ChartOptions & { annotation: any });
  public lineChartColors: Color[];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }

}
