import { STATUS } from '../../consts';

export interface Client {
  clientId: number;
  imgId: number;
  priority: number;
  status: STATUS.WAITING | STATUS.IN_QUEUE;
}
