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

export async function dayGoodsCountExcel({ restParams }) {
  window.location.href = `${api.dayGoodsCountExcel}?keyword=${restParams.keyword}&startTime=${restParams.startTime}&endTime=${restParams.endTime}`;
}
