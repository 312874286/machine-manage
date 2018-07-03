import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function savePointSetting({ params }) {
  return fetch.post(api.savePointSetting, {
    body: stringify(params),
  });
}

export async function getPointSettingList({ params, restParams }) {
  return fetch.get(api.getPointSettingList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function editPointSetting({ params }) {
  return fetch.post(api.updatePointSetting, {
    body: stringify(params),
  });
}

export async function delPointSetting({ params }) {
  return fetch.post(api.deletePointSetting, {
    body: stringify(params),
  });
}
