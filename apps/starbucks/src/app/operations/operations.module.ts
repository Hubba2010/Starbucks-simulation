import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OperationsComponent } from './operations.component';
import { ButtonModule } from '../shared/components/button/button.module';

@NgModule({
  declarations: [OperationsComponent],
  exports: [OperationsComponent],
  imports: [CommonModule, BrowserModule, ButtonModule],
})
export class OperationsModule {}
