import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function machineLocaleDetailList({ restParams }) {
  return fetch.get(api.machineLocaleDetailList, { restParams });
}
export async function machineLocaleDetail({ restParams }) {
  return fetch.get(api.machineLocaleDetail, { restParams });
}
