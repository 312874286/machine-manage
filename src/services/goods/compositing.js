import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getCompositList({ restParams }) {
  return fetch.get(api.getCompositList, {
    restParams,
  });
}

export async function addOrEditRule({ params }) {
  return fetch.post(api.addOrEditRule, {
    body: stringify(params),
  });
}

export async function getCompositDetail({ restParams }) {
  return fetch.get(api.getCompositDetail, {
    restParams,
  });
}

export async function updateCompositSellState({ params }) {
  return fetch.post(api.updateCompositSellState, {
    body: stringify(params),
  });
}

export async function delComposit({ params }) {
  return fetch.post(api.delComposit, {
    body: stringify(params),
  });
}
