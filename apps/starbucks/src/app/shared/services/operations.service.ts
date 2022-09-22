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

  constructor(private barService: BarService) {
    this.barService.clientsSub$.subscribe((clients) => {
      this.clientsAmount = clients.length;
      this.clientsAmountSub$.next(this.clientsAmount);
    });
  }

  addBarista(): void {
    if (this.baristasAmount >= BARISTAS_LIMIT) return;
    this.barService.onAddBarista();
    this.baristasAmountSub$.next(++this.baristasAmount);
  }
  removeBarista(): void {
    if (!this.baristasAmount) return;
    this.barService.onRemoveBarista();
    this.baristasAmountSub$.next(--this.baristasAmount);
  }
  addClient(): void {
    if (this.clientsAmount >= CLIENTS_LIMIT) return;
    this.barService.onAddClient();
  }
}
