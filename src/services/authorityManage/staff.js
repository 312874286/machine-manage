import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getSystemUserList({ params, restParams }) {
  return fetch.get(api.getSystemUserList, {
    restParams,
  });
}
