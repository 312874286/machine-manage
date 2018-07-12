import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function getOrderList({ params, restParams }) {
  return fetch.get(api.getOrdersList, {
    body: JSON.stringify(params),
    restParams,
  });
}

