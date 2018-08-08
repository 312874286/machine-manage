import fetch from '../../utils/fetch';
import api from './api';
import {stringify} from "qs";

export async function getCitysByProvince({ restParams }) {
  return fetch.get(api.getCitysByProvince, { restParams });
}

export async function uploadFile({ params, restParams }) {
  const file = new FormData();
  file.append('file', params.file);
  return fetch.postFile(api.uploadFile, { restParams, body: file });
}
export async function getProvinceCityAreaTradeArea({ restParams }) {
  return fetch.get(api.getProvinceCityAreaTradeArea, {
    restParams,
  });
}
export async function getUserArea({ restParams }) {
  return fetch.get(api.getUserArea, {
    restParams,
  });
}
