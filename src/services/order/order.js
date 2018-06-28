import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getOrderList({ restParams }) {
  return fetch.get(api.getOrderList, {
    restParams,
  });
}
