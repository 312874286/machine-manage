import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function searchAppVersion({ params }) {
  return fetch.post(api.searchAppVersion, {
    body: stringify(params),
  });
}