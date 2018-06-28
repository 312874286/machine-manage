import fetch from '../../utils/fetch';
import api from './api';


export async function getLogList({ restParams }) {
  if (!restParams.type) {
    restParams.type = '';
  }
  return fetch.get(api.getLogList, {
    restParams,
  });
}
