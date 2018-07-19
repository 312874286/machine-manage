import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getCheckFaultList({ params }) {
  return fetch.post(api.getCheckFaultList, {
    body: stringify(params),
  });
}
