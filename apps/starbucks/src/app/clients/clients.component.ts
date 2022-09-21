import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BarService } from '../shared/services/bar.service';

@Component({
  selector: 'starbucks-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  clients$ = this.barService.clientsSub$

  constructor(private barService: BarService) {}
}
