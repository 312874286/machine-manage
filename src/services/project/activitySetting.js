import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveActivitySetting({ params }) {
  return fetch.postJSON(api.saveActivitySetting, {
    body: JSON.stringify(params),
  });
}

export async function getActivitySettingList({ params, restParams }) {
  return fetch.get(api.getActivitySettingList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function getActivityCount({ restParams }) {
  return fetch.postJSON(api.getActivityCount, {
    body: JSON.stringify(restParams),
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

export async function getMerchantShops({ restParams }) {
  return fetch.get(api.getMerchantShops, {
    restParams,
  });
}

export async function getShopsList({ restParams }) {
  return fetch.get(api.getShopsList, {
    restParams,
  });
}

export async function editActivitySetting({ params }) {
  return fetch.postJSON(api.updateActivitySetting, {
    body: JSON.stringify(params),
  });
}

export async function delActivitySetting({ params }) {
  return fetch.post(api.deleteActivitySetting, {
    body: stringify(params),
  });
}

export async function getGameList({ params }) {
  return fetch.post(api.getGameList, {
    body: stringify(params),
  });
}

export async function getDefaultActivity({ restParams }) {
  return fetch.get(api.getDefaultActivity, {
    restParams,
  });
}
