import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getWechats({ restParams }) {
  return fetch.get(api.getWechats, { restParams });
}

export async function setWechat({ params, restParams }) {
  return fetch.put(api.setWechats, {
    body: JSON.stringify(params.data),
    restParams,
  });
}
