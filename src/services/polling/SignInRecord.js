import fetch from '../../utils/fetch';
import api from './api';
import {stringify} from "qs";

export async function getRecordList({ restParams }) {
  return fetch.get(api.getRecordList, {
    restParams,
  });
}
export async function userExcel({ restParams }) {
  return fetch.get(api.userExcel, {
    restParams,
  });
}
