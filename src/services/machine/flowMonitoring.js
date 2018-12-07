import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function flowMonitoring({ restParams }) {
  return fetch.get(api.flowMonitoring, {
    restParams,
  });
}


