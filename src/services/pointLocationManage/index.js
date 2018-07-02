import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function savePointLocation({ params }) {
  return fetch.post(api.savePointLocation, {
    body: stringify(params),
  });
}

export async function getPointLocationList({ params, restParams }) {
  return fetch.get(api.getPointLocationList, {
    body: JSON.stringify(params),
    restParams,
  });
}
