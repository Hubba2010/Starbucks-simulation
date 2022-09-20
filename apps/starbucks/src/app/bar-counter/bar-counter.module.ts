import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BarCounterComponent } from './bar-counter.component';

@NgModule({
  declarations: [BarCounterComponent],
  exports: [BarCounterComponent],
  imports: [BrowserModule],
})
export class BarCounterModule {}
