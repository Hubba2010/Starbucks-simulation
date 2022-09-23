import { BARISTA_STATUS } from '../../consts';

export interface Barista {
  id: number;
  status: BARISTA_STATUS.AVAILABLE | BARISTA_STATUS.BUSY;
  progress?: number;
  client?: number;
}
