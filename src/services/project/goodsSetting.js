import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveGoodsSetting({ params }) {
  return fetch.post(api.saveGoodsSetting, {
    body: stringify(params),
  });
}

export async function getGoodsSettingList({ params, restParams }) {
  return fetch.get(api.getGoodsSettingList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function getGoodsSettingDetail({ restParams }) {
  return fetch.get(api.getGoodsSettingDetail, {
    restParams,
  });
}

export async function getMerchantsList({ restParams }) {
  return fetch.get(api.getMerchantsList, {
    restParams,
  });
}

export async function getActivityList({ restParams }) {
  return fetch.get(api.getActivityList, {
    restParams,
  });
}

export async function getShopsList({ restParams }) {
  return fetch.get(api.getShopsList, {
    restParams,
  });
}

export async function editGoodsSetting({ params }) {
  return fetch.post(api.updateGoodsSetting, {
    body: stringify(params),
  });
}

export async function delGoodsSetting({ params }) {
  return fetch.post(api.deleteGoodsSetting, {
    body: stringify(params),
  });
}
