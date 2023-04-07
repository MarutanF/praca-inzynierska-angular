import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RatesComponent } from './rates/rates.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AppRoutingModule } from './app-routing.module';
import { CacheInterceptor } from './cache/cache-interceptor';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { RegulationComponent } from './regulation/regulation.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HelpComponent } from './help/help.component';
import { OptimalAlertsComponent } from './optimal-alerts/optimal-alerts.component';
import { AmountAlertsComponent } from './amount-alerts/amount-alerts.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RatesComponent,
    CalculatorComponent,
    AlertsComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    RegulationComponent,
    AboutUsComponent,
    HelpComponent,
    OptimalAlertsComponent,
    AmountAlertsComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserModule,
    NgbModule,
    ChartsModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
