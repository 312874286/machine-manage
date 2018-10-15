import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function addBatch({ params }) {
  return fetch.postJSON(api.addBatch, {
    body: JSON.stringify(params),
  });
}
export async function updateBatch({ params }) {
  return fetch.postJSON(api.updateBatch, {
      body: JSON.stringify(params),
  });
}
export async function batchList({ params }) {
  return fetch.post(api.batchList, {
    body: stringify(params),
  });
}
export async function batchDetail({ restParams }) {
  return fetch.get(api.batchDetail, {
    restParams,
  });
}
