import { stringify } from 'qs';

import fetch from '../../utils/fetch';
import api from './api';

export async function getRecordList({ restParams }) {
  console.log(restParams)
  return fetch.get(api.getRecordList, {
    restParams,
  });
}
export async function userExcel({ restParams }) {
  window.location.href = `${api.userExcel}?keyword=${restParams.keyword}&code=${restParams.code}&startTime=${restParams.startTime}&endTime=${restParams.endTime}`;
}
export async function updateStatus({ params }) {
  return fetch.post(api.updateSignInStatus, {
    body: stringify(params)
  })
}
