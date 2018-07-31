import fetch from '../../utils/fetch';
import api from './api';

export async function getRecordList({ restParams }) {
  return fetch.get(api.getRecordList, {
    restParams,
  });
}
export async function userExcel({ restParams }) {
  window.location.href = `${api.userExcel}?keyword=${restParams.keyword}&code=${restParams.code}&startTime=${restParams.startTime}&endTime=${restParams.endTime}`;
}
