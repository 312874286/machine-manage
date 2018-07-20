import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getCheckFaultList({ params }) {
  return fetch.post(api.getCheckFaultList, {
    body: stringify(params),
  });
}

export async function getCheckFaultDetail({ params }) {
  return fetch.post(api.getCheckFaultDetail, {
    body: stringify(params),
  });
}

export async function getCheckFaultAnswer({ params }) {
  return fetch.post(api.getCheckFaultAnswer, {
    body: stringify(params),
  });
}


