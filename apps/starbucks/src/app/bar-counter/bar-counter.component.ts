import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OperationsService } from '../shared/services/operations.service';

@Component({
  selector: 'starbucks-counter',
  templateUrl: './bar-counter.component.html',
  styleUrls: ['./bar-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarCounterComponent {
  baristasAmount$ = this.operationsService.baristasAmountSub$;
  constructor(private operationsService: OperationsService) {}
}
