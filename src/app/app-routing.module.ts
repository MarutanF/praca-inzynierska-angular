import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { RatesComponent } from './rates/rates.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { AlertsComponent } from './alerts/alerts.component';
import { PlaygroundComponent } from './playground/playground.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/rates', pathMatch: 'full' },
    { path: 'rates', component: RatesComponent },
    { path: 'calculator', component: CalculatorComponent },
    { path: 'alerts', component: AlertsComponent },
    { path: 'playground', component: PlaygroundComponent },
    { path: '**', redirectTo: '/rates' },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}