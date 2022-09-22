import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BarService } from '../shared/services/bar.service';

@Component({
  selector: 'starbucks-counter',
  templateUrl: './bar-counter.component.html',
  styleUrls: ['./bar-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarCounterComponent {
  baristasSub$ = this.barService.baristasSub$;
  constructor(private barService: BarService) {}
}
