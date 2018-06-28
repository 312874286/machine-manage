
import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getList() {
  return fetch.get(api.getOrderServiceList);
}

export async function exportList({ restParams }) {
  return window.open(`${api.exportOrderServiceList}?${stringify(restParams)}`);
}
