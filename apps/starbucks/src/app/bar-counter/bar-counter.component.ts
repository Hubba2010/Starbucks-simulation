import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'starbucks-counter',
  templateUrl: './bar-counter.component.html',
  styleUrls: ['./bar-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarCounterComponent {}
