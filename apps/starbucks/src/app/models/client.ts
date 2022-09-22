import { CLIENT_STATUS } from '../../consts';

export interface Client {
  id: number;
  imgId: number;
  status:
    | CLIENT_STATUS.WAITING
    | CLIENT_STATUS.ABOUT_TO_ORDER
    | CLIENT_STATUS.IN_QUEUE;
}
