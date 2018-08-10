import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function replenishList({ params, restParams }) {
  return fetch.postJSON(api.replenishList, {
    body: JSON.stringify(params),
    restParams
  });
}

export async function replenishDetail({ restParams }) {
  return fetch.get(api.replenishDetail, {
    restParams
  });
}


