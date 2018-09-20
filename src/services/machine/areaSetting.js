import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function addArea({ params }) {
  return fetch.postJSON(api.addArea, {
    body: JSON.stringify(params),
  });
}
export async function updateArea({ params }) {
  return fetch.postJSON(api.updateArea, {
      body: JSON.stringify(params),
  });
}
export async function areaList({ restParams, params }) {
  return fetch.get(api.areaList, {
    restParams,
  });
}
export async function areaDetail({ restParams }) {
  return fetch.get(api.areaDetail, {
    restParams,
  });
}
