import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RatesComponent } from './rates/rates.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { AlertsComponent } from './alerts/alerts.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth/auth.guard';
import { RegulationComponent } from './regulation/regulation.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HelpComponent } from './help/help.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/rates', pathMatch: 'full' },
    { path: 'rates', component: RatesComponent },
    { path: 'calculator', component: CalculatorComponent },
    { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'regulation', component: RegulationComponent },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'help', component: HelpComponent },
    { path: '**', redirectTo: '/rates' },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {

}