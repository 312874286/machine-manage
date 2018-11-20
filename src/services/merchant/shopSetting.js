import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveShopSetting({ params }) {
  return fetch.post(api.saveShopSetting, {
    body: stringify(params),
  });
}

export async function getShopSettingList({ params }) {
  return fetch.get(api.getShopSettingList, {
    body: JSON.stringify(params),
  });
}

export async function getShopSettingDetail({ restParams }) {
  return fetch.get(api.getShopSettingDetail, {
    restParams,
  });
}

export async function getMerchantsList({ restParams }) {
  return fetch.get(api.getMerchantsList, {
    restParams,
  });
}

export async function getChannelList({ restParams }) {
  return fetch.get(api.getChannelList, {
    restParams,
  });
}

export async function editShopSetting({ params }) {
  return fetch.post(api.updateShopSetting, {
    body: stringify(params),
  });
}
export async function getBaseDict({ params }) {
  return fetch.post(api.getBaseDict, {
    body: stringify(params),
  });
}
