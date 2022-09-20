import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BarCounterModule } from './bar-counter/bar-counter.module';
import { OperationsModule } from './operations/operations.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BarCounterModule, OperationsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
