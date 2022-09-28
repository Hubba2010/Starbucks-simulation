import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Subscription,
  takeWhile,
  timer,
} from 'rxjs';
import { BARISTAS_LIMIT, BARISTA_STATUS, CLIENT_STATUS } from 'consts';
import { Client, Barista } from 'app/models';
import { generateRandomNumbers, generateRandomTime } from 'utils';

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
    const [id, imgId] = [...generateRandomNumbers()];
    this.clients.push({
      id: id,
      imgId: imgId,
      status:
        this.clients.length >= BARISTAS_LIMIT
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
    this.updateClients();
  }

  onBaristaRelease(baristaIndex: number) {
    this.intervalSubs[baristaIndex].unsubscribe();
    this.baristas[baristaIndex] = {
      ...this.baristas[baristaIndex],
      client: undefined,
      status: BARISTA_STATUS.AVAILABLE,
      progress: 0,
    };
    this.updateBaristas();
  }

  shiftQueue(): void {
    const firstInQueue = this.clients.findIndex(
      (client: Client) => client.status === CLIENT_STATUS.IN_QUEUE
    );
    if (firstInQueue === -1) return;
    this.clients[firstInQueue].status = CLIENT_STATUS.ABOUT_TO_ORDER;
  }

  onAddBarista(): void {
    const bId = this.baristas.length + 1;
    const newBarista = { id: bId, status: BARISTA_STATUS.AVAILABLE };
    this.baristas.push(newBarista);
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
    const servedClientIndex = this.clients.findIndex(
      (client: Client) => client.id === servedClient
    );
    this.clients[servedClientIndex].status = CLIENT_STATUS.ABOUT_TO_ORDER;
    this.baristas.pop();
    this.updateClients();
    this.updateBaristas();
    this.serveValidClient();
  }

  findClientToServe(): Client | undefined {
    return this.clients.find(
      (client: Client) => client.status === CLIENT_STATUS.ABOUT_TO_ORDER
    );
  }

  findFreeBarista(): Barista | undefined {
    return this.baristas.find(
      (barista: Barista) => barista.status !== BARISTA_STATUS.BUSY
    );
  }

  overwriteIdleStatus(
    barista: Barista,
    client: Client,
    baristaIndex: number,
    clientIndex: number
  ) {
    barista.status = BARISTA_STATUS.BUSY;
    barista.client = client.id;
    client.status = CLIENT_STATUS.WAITING;
    this.baristas[baristaIndex] = barista;
    this.clients[clientIndex] = client;
    this.updateBaristas();
    this.updateClients();
  }

  serveValidClient(): void {
    const barista = this.findFreeBarista();
    const client = this.findClientToServe();
    if (!client || !barista) return;
    const baristaIndex = this.baristas.indexOf(barista);
    const clientIndex = this.clients.indexOf(client);
    this.overwriteIdleStatus(barista, client, baristaIndex, clientIndex);
    this.takeOrder(baristaIndex, client.id);
  }

  takeOrder(baristaIndex: number, clientIndex: number) {
    this.clearPreviousOrderSubscriptions(baristaIndex);
    const randomTime = generateRandomTime();
    const completionTime = new Date().getTime() + randomTime;
    const makingCoffee = timer(randomTime).pipe(
      takeWhile(() => !!this.baristas[baristaIndex])
    );
    this.intervalSubs[baristaIndex] = interval(UPDATE_INTERVAL)
      .pipe(takeWhile(() => !!this.baristas[baristaIndex]))
      .subscribe(() => {
        this.updateProgress(randomTime, completionTime, baristaIndex);
      });
    this.timerSubs[baristaIndex] = makingCoffee.subscribe(() => {
      this.onClientServe(clientIndex);
      this.onBaristaRelease(baristaIndex);
      this.serveValidClient();
    });
  }

  updateProgress(
    randomTime: number,
    completionTime: number,
    baristaIndex: number
  ): void {
    const timeLeft = completionTime - new Date().getTime();
    const progress = Math.floor(100 - (timeLeft / randomTime) * 100);
    this.baristas[baristaIndex].progress = progress;
    this.updateBaristas();
  }

  clearPreviousOrderSubscriptions(baristaIndex: number): void {
    if (this.timerSubs[baristaIndex])
      this.timerSubs[baristaIndex].unsubscribe();
    if (this.intervalSubs[baristaIndex])
      this.intervalSubs[baristaIndex].unsubscribe();
  }

  updateClients(): void {
    this.clientsSub$.next(this.clients);
  }

  updateBaristas(): void {
    this.baristasSub$.next(this.baristas);
  }
}
