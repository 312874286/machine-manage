import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getDiseases({ restParams }) {
  return fetch.get(api.getDiseases, {
    restParams,
  });
}

export async function getDisease({ restParams }) {
  return fetch.get(api.getDisease, {
    restParams,
  });
}
export async function putDisease({ params }) {
  return fetch.post(api.putDisease, {
    body: stringify(params),
  });
}

export async function delDisease({ restParams }) {
  return fetch.get(api.delDisease, {
    restParams,
  });
}
