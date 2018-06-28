import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getSuggestList({ restParams }) {
  return fetch.get(api.getSuggestList, {
    restParams,
  });
}

export async function getSuggestDetail({ restParams }) {
  return fetch.get(api.getSuggestDetail, {
    restParams,
  });
}

export async function audit({ params, restParams }) {
  return fetch.post(api.audit, {
    restParams,
    body: stringify(params),
  });
}

