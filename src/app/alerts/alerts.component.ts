import { Component, OnInit } from '@angular/core';
import { FirebaseOptimalAlertsService, OptimalAlert } from '../services/firebase-optimal-alerts.service';
import { ChildActivationStart } from '@angular/router';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  public alert$;

  constructor(private optimalAlertService: FirebaseOptimalAlertsService) {
    this.alert$ = this.optimalAlertService.getUserAlerts();
   }

  ngOnInit() {
  }

  myFun(data){
    console.log('Alert click');
  }

  myFun2(){
    console.log('Button click');
  }

}
