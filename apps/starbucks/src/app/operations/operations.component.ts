import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OperationsService } from '../shared/services/operations.service';
import { BARISTAS_LIMIT, CLIENTS_LIMIT } from '../../consts';

@Component({
  selector: 'starbucks-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsComponent {
  BARISTAS_LIMIT = BARISTAS_LIMIT;
  CLIENTS_LIMIT = CLIENTS_LIMIT;
  baristasAmount$ = this.operationsService.baristasAmountSub$;
  clientsAmount$ = this.operationsService.clientsAmountSub$;

  constructor(private operationsService: OperationsService) {}

  addClient(): void {
    this.operationsService.addClient();
  }
  addBarista(): void {
    this.operationsService.addBarista();
  }
  removeBarista(): void {
    this.operationsService.removeBarista();
  }
}
