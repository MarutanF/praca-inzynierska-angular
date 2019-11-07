import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RatesComponent } from './rates/rates.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { AlertsComponent } from './alerts/alerts.component';
import { PlaygroundComponent } from './playground/playground.component';
import { AppRoutingModule } from './app-routing.module';
import { CacheInterceptor } from './cache/cache-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RatesComponent,
    CalculatorComponent,
    AlertsComponent,
    PlaygroundComponent
  ],
  imports: [
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
