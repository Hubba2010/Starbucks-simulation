import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { STATUS } from 'apps/starbucks/src/consts';
import { Client } from '../../models/client';

@Injectable({ providedIn: 'root' })
export class BarService {
  clients: Client[] = [];
  clientsSub$ = new BehaviorSubject<Client[]>([]);

  onAddClient() {
    const clientPriority = this.clients.length + 1;
    const [id, imgId] = [...this.generateRandomNumbers()];
    this.clients.push({
      clientId: id,
      imgId: imgId,
      priority: clientPriority,
      status: clientPriority > 6 ? STATUS.IN_QUEUE : STATUS.WAITING,
    });
    console.log(this.clients);
    this.updateClients(this.clients);
  }

  updateClients(clients: Client[]): void {
    this.clientsSub$.next(clients);
  }

  generateRandomNumbers(): [number, number] {
    return [Math.random(), Math.floor(Math.random() * 6) + 1];
  }
}
