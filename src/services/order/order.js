import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function getOrderList({ restParams }) {
  return fetch.get(api.getOrdersList, {
    restParams,
  });
}
export async function historydayGoodsCount({ restParams }) {
  return fetch.get(api.historydayGoodsCount, {
    restParams,
  });
}
