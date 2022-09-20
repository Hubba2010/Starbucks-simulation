import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'starbucks-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsComponent {}
