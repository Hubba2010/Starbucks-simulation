import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, take, timer } from 'rxjs';
import {
  BARISTAS_LIMIT,
  BARISTA_STATUS,
  CLIENT_STATUS,
  DURATIONS,
} from 'apps/starbucks/src/consts';
import { Client, Barista } from '../../models';

@Injectable({ providedIn: 'root' })
export class BarService {
  baristas: Barista[] = [];
  clients: Client[] = [];
  baristasSub$ = new BehaviorSubject<Barista[]>([]);
  clientsSub$ = new BehaviorSubject<Client[]>([]);

  onAddClient() {
    const [id, imgId] = [...this.generateRandomNumbers()];
    this.clients.push({
      id: id,
      imgId: imgId,
      status:
        this.clients.length + 1 > BARISTAS_LIMIT
          ? CLIENT_STATUS.IN_QUEUE
          : CLIENT_STATUS.ABOUT_TO_ORDER,
    });
    this.updateClients(this.clients);
    this.serveValidClient();
  }

  onClientServe(clientId: number) {
    const index = this.clients.findIndex(
      (client: Client) => client.id === clientId
    );
    console.log(index);
    this.clients.splice(index, 1);
    this.shiftQueue();
    this.clientsSub$.next(this.clients);
  }

  shiftQueue() {
    const lastInQueue = this.clients.find(
      (client: Client) => client.status === CLIENT_STATUS.IN_QUEUE
    );
    if (!lastInQueue) return;
    const lastInQueueIndex = this.clients.indexOf(lastInQueue);
    this.clients[lastInQueueIndex].status = CLIENT_STATUS.ABOUT_TO_ORDER;
  }

  onAddBarista() {
    const bId = this.baristas.length + 1;
    this.baristas.push({ id: bId, status: BARISTA_STATUS.AVAILABLE });
    this.baristasSub$.next(this.baristas);
    this.serveValidClient();
  }
  onRemoveBarista() {
    this.baristas.pop();
    this.baristasSub$.next(this.baristas);
  }

  checkIfClient(): Client | undefined {
    return this.clients.find(
      (client: Client) => client.status === CLIENT_STATUS.ABOUT_TO_ORDER
    );
  }

  checkBaristaAvailability(): Barista | undefined {
    return this.baristas.find(
      (barista: Barista) => barista.status !== BARISTA_STATUS.BUSY
    );
  }

  serveValidClient(): void {
    const barista = this.checkBaristaAvailability();
    const client = this.checkIfClient();
    if (!client || !barista) return;
    const bIndex = this.baristas.indexOf(barista);
    const cIndex = this.clients.indexOf(client);
    const clientId = client.id;
    barista.status = BARISTA_STATUS.BUSY;
    client.status = CLIENT_STATUS.WAITING;
    this.baristas[bIndex] = barista;
    this.clients[cIndex] = client;
    this.takeOrder(bIndex, clientId);
  }

  takeOrder(bIndex: number, cIndex: number) {
    const randomTime = this.generateRandomTime();
    const makingCoffee = timer(randomTime).pipe(take(1));
    const completionTime = new Date().getTime() + randomTime;
    const updateProgress = interval(200).subscribe(() => {
      const timeLeft = completionTime - new Date().getTime();
      const progress = Math.floor(100 - (timeLeft / randomTime) * 100);
      this.baristas[bIndex].progress = progress;
      this.baristasSub$.next(this.baristas);
    });
    makingCoffee.subscribe(() => {
      if (!this.baristas[bIndex]) return;
      updateProgress.unsubscribe();
      this.onClientServe(cIndex);
      this.baristas[bIndex].status = BARISTA_STATUS.AVAILABLE;
      this.baristas[bIndex].progress = 0;
      this.baristasSub$.next(this.baristas);
      this.serveValidClient();
    });
  }

  updateClients(clients: Client[]): void {
    this.clientsSub$.next(clients);
  }

  generateRandomTime() {
    const min = Math.ceil(DURATIONS.MIN);
    const max = Math.floor(DURATIONS.MAX) + 1;
    return Math.floor(Math.random() * (max - min) + min) * 1000;
  }

  generateRandomNumbers(): [number, number] {
    return [Math.random(), Math.floor(Math.random() * 6) + 1];
  }
}
