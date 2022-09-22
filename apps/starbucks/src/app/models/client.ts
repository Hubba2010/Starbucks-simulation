import { CLIENT_STATUS } from '../../consts';

export interface Client {
  clientId: number;
  imgId: number;
  priority: number;
  status: CLIENT_STATUS.WAITING | CLIENT_STATUS.IN_QUEUE;
}
