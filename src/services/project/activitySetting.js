import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveActivitySetting({ params }) {
  return fetch.post(api.saveActivitySetting, {
    body: stringify(params),
  });
}

export async function getActivitySettingList({ params, restParams }) {
  return fetch.get(api.getActivitySettingList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function getActivitySettingDetail({ restParams }) {
  return fetch.get(api.getActivitySettingDetail, {
    restParams,
  });
}

export async function getMerchantsList({ restParams }) {
  return fetch.get(api.getMerchantsList, {
    restParams,
  });
}

export async function getShopsList({ restParams }) {
  return fetch.get(api.getShopsList, {
    restParams,
  });
}

export async function editActivitySetting({ params }) {
  return fetch.post(api.updateActivitySetting, {
    body: stringify(params),
  });
}

export async function delActivitySetting({ params }) {
  return fetch.post(api.deleteActivitySetting, {
    body: stringify(params),
  });
}
