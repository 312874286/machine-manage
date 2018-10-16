import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function saveVersion({ params }) {
  return fetch.post(api.saveVersion, {
    body: stringify(params),
  });
}

export async function getAppVersionList({ restParams }) {
  return fetch.get(api.getAppVersionList, {
    restParams,
  });
}

export async function appList({ }) {
  return fetch.get(api.appList);
}

