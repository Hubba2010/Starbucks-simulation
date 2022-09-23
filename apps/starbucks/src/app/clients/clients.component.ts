import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BarService } from '../shared/services/bar.service';
import { CLIENT_STATUS } from '../../consts';

@Component({
  selector: 'starbucks-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  CLIENT_STATUS = CLIENT_STATUS;
  clients$ = this.barService.clientsSub$;

  constructor(private barService: BarService) {}
}
