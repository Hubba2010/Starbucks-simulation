import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProgressBarModule } from '../shared/components/progress-bar/progress-bar.module';

import { BarCounterComponent } from './bar-counter.component';

@NgModule({
  declarations: [BarCounterComponent],
  exports: [BarCounterComponent],
  imports: [BrowserModule, ProgressBarModule],
})
export class BarCounterModule {}
