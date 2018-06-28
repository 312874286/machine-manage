import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getDetail({ restParams }) {
  return fetch.get(api.getMerchant, { restParams });
}

export async function setMerchantsBasic({ params, restParams }) {
  return fetch.put(api.setMerchantsBasic, {
    body: JSON.stringify(params.data),
    restParams,
  });
}
