import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function savePointSetting({ params }) {
  return fetch.post(api.savePointSetting, {
    body: stringify(params),
  });
}

export async function getPointSettingList({ restParams }) {
  return fetch.get(api.getPointSettingList, {
    restParams,
  });
}

export async function getPointSettingDetail({ restParams }) {
  return fetch.get(api.getPointSettingDetail, {
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

export async function getTagList({ restParams }) {
  return fetch.get(api.getTagList, {
    restParams,
  });
}

export async function updateBatchMonitor({ params }) {
  return fetch.postJSON(api.updateBatchMonitor, {
    body: JSON.stringify(params),
  });
}

