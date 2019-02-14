import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function replenishList({ params, restParams }) {
  return fetch.get(api.replenishList, {
    restParams
  });
}

export async function replenishDetail({ restParams }) {
  return fetch.get(api.replenishDetail, {
    restParams
  });
}


