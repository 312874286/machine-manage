import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function getList({ restParams }) {
  return fetch.get(api.getList, {
    restParams,
  });
}

