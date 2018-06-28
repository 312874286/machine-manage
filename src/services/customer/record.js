import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function saveRecord({ params }) {
  return fetch.post(api.saveRecord, {
    body: stringify(params),
  });
}

export async function getRecordList({ restParams }) {
  return fetch.get(api.getRecordList, {
    restParams,
  });
}
