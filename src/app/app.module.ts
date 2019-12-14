import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConsoleService } from './d3/test.service';
import { NegativeChartComponent } from './components/negative-chart/negative-chart.component';
import { NegativeVerticalChartComponent } from './components/negative-vertical-chart/negative-vertical-chart.component'


@NgModule({
  declarations: [
    AppComponent,
    NegativeChartComponent,
    NegativeVerticalChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ConsoleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
