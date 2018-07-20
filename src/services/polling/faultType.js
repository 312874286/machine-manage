import fetch from '../../utils/fetch';
import api from './api';

export async function getFaultTypeList({ restParams }) {
  return fetch.get(api.getRecordList, {
    restParams,
  });
}
