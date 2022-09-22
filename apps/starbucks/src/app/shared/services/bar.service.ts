import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BARISTA_STATUS, CLIENT_STATUS } from 'apps/starbucks/src/consts';
import { Client, Barista } from '../../models';

@Injectable({ providedIn: 'root' })
export class BarService {
  baristas: Barista[] = [];
  clients: Client[] = [];
  baristasSub$ = new BehaviorSubject<Barista[]>([]);
  clientsSub$ = new BehaviorSubject<Client[]>([]);

  onAddClient() {
    const clientPriority = this.clients.length + 1;
    const [id, imgId] = [...this.generateRandomNumbers()];
    this.clients.push({
      clientId: id,
      imgId: imgId,
      priority: clientPriority,
      status:
        clientPriority > 6 ? CLIENT_STATUS.IN_QUEUE : CLIENT_STATUS.WAITING,
    });
    console.log(this.clients);
    this.updateClients(this.clients);
  }

  onClientServe(priority: number) {
    const index = this.clients.findIndex(
      (client: Client) => client.priority === priority - 1
    );
    this.clients.splice(index, 1);
    this.clientsSub$.next(this.clients);
  }

  onAddBarista() {
    const bId = this.baristas.length + 1;
    this.baristas.push({ id: bId, status: BARISTA_STATUS.AVAILABLE });
    this.baristasSub$.next(this.baristas);
  }
  onRemoveBarista() {
    this.baristas.pop();
    this.baristasSub$.next(this.baristas);
  }

  //   Check barista availability if there is a free one, order and replace priority

  updateClients(clients: Client[]): void {
    this.clientsSub$.next(clients);
  }

  generateRandomNumbers(): [number, number] {
    return [Math.random(), Math.floor(Math.random() * 6) + 1];
  }
}
