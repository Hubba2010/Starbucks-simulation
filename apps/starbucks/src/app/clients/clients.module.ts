import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClientsComponent } from './clients.component';
import { ButtonModule } from '../shared/components/button/button.module';

@NgModule({
  declarations: [ClientsComponent],
  exports: [ClientsComponent],
  imports: [CommonModule, BrowserModule, ButtonModule],
})
export class ClientsModule {}
