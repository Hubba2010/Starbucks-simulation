import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Subscription,
  takeWhile,
  timer,
} from 'rxjs';
import {
  BARISTAS_LIMIT,
  BARISTA_STATUS,
  CLIENT_STATUS,
  DURATIONS,
} from 'apps/starbucks/src/consts';
import { Client, Barista } from '../../models';

// Interval for updating progress bars
const UPDATE_INTERVAL = 100;

@Injectable({ providedIn: 'root' })
export class BarService {
  baristas: Barista[] = [];
  clients: Client[] = [];
  baristasSub$ = new BehaviorSubject<Barista[]>([]);
  clientsSub$ = new BehaviorSubject<Client[]>([]);
  timerSubs: Subscription[] = [];
  intervalSubs: Subscription[] = [];

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
    this.updateClients();
    this.serveValidClient();
  }

  onClientServe(clientId: number) {
    const index = this.clients.findIndex(
      (client: Client) => client.id === clientId
    );
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
    this.updateBaristas();
    this.serveValidClient();
  }
  onRemoveBarista() {
    const servedClient = this.baristas.slice(-1)[0].client;
    if (!servedClient) {
      this.baristas.pop();
      this.updateBaristas();
      return;
    }
    const index = this.clients.findIndex(
      (client: Client) => client.id === servedClient
    );
    this.clients[index].status = CLIENT_STATUS.ABOUT_TO_ORDER;
    this.baristas.pop();
    this.updateClients();
    this.updateBaristas();
    this.serveValidClient();
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
    barista.client = clientId;
    client.status = CLIENT_STATUS.WAITING;
    this.baristas[bIndex] = barista;
    this.clients[cIndex] = client;
    this.updateClients();
    this.takeOrder(bIndex, clientId);
  }

  takeOrder(bIndex: number, cIndex: number) {
    // Cancel previous subscriptions to avoid memory leaks (if barista was removed recently)
    if (this.timerSubs[bIndex]) this.timerSubs[bIndex].unsubscribe();
    if (this.intervalSubs[bIndex]) this.intervalSubs[bIndex].unsubscribe();

    const randomTime = this.generateRandomTime();
    const makingCoffee = timer(randomTime).pipe(
      takeWhile(() => !!this.baristas[bIndex])
    );
    const completionTime = new Date().getTime() + randomTime;
    this.intervalSubs[bIndex] = interval(UPDATE_INTERVAL)
      .pipe(takeWhile(() => !!this.baristas[bIndex]))
      .subscribe(() => {
        const timeLeft = completionTime - new Date().getTime();
        const progress = Math.floor(100 - (timeLeft / randomTime) * 100);
        this.baristas[bIndex].progress = progress;
        this.updateBaristas();
      });
    this.timerSubs[bIndex] = makingCoffee.subscribe(() => {
      this.intervalSubs[bIndex].unsubscribe();
      this.onClientServe(cIndex);
      this.baristas[bIndex] = {
        ...this.baristas[bIndex],
        client: undefined,
        status: BARISTA_STATUS.AVAILABLE,
        progress: 0,
      };
      this.updateBaristas();
      this.serveValidClient();
    });
  }

  updateBaristas(): void {
    this.baristasSub$.next(this.baristas);
  }

  updateClients(): void {
    this.clientsSub$.next(this.clients);
  }

  generateRandomTime(): number {
    const min = Math.ceil(DURATIONS.MIN);
    const max = Math.floor(DURATIONS.MAX) + 1;
    return Math.floor(Math.random() * (max - min) + min) * 1000;
  }

  generateRandomNumbers(): [number, number] {
    return [Math.random(), Math.floor(Math.random() * 6) + 1];
  }
}
