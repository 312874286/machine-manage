import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getCommissionList({ restParams }) {
  return fetch.get(api.getCommissionList, { restParams });
}

export async function getCommissionDetail({ restParams }) {
  return fetch.get(api.getCommissionDetail, { restParams });
}

export async function getCommissionDoctor({ restParams }) {
  return fetch.get(api.getCommissionDoctor, { restParams });
}

export async function saveCommissionDoctor({ params, restParams }) {
  return fetch.postJSON(api.saveCommissionDoctor, {
    restParams,
    body: JSON.stringify(params),
  });
}

export async function abolish({ params, restParams }) {
  return fetch.post(api.abolish, {
    restParams,
    body: stringify(params),
  });
}
