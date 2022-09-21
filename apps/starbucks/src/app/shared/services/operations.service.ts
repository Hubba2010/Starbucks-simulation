import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BARISTAS_LIMIT, CLIENTS_LIMIT } from 'apps/starbucks/src/consts';
import { BarService } from './bar.service';

@Injectable({ providedIn: 'root' })
export class OperationsService {
  baristasAmount = 0;
  clientsAmount = 0;
  baristasAmountSub$ = new BehaviorSubject<number>(this.baristasAmount);
  clientsAmountSub$ = new BehaviorSubject<number>(this.clientsAmount);

  constructor(private barService: BarService) {}

  addBarista(): void {
    if (this.baristasAmount >= BARISTAS_LIMIT) return;
    this.baristasAmountSub$.next(++this.baristasAmount);
  }
  removeBarista(): void {
    if (!this.baristasAmount) return;
    this.baristasAmountSub$.next(--this.baristasAmount);
  }
  addClient(): void {
    if (this.clientsAmount >= CLIENTS_LIMIT) return;
    this.barService.onAddClient();
    this.clientsAmountSub$.next(++this.clientsAmount);
  }
}
