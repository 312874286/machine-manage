import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveGameSetting({ params }) {
  return fetch.post(api.saveGameSetting, {
    body: stringify(params),
  });
}

export async function getGameSettingList({ params, restParams }) {
  return fetch.get(api.getGameSettingList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function getGameSettingDetail({ restParams }) {
  return fetch.get(api.getGameSettingDetail, {
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

export async function editGameSetting({ params }) {
  return fetch.post(api.updateGameSetting, {
    body: stringify(params),
  });
}

export async function delGameSetting({ params }) {
  return fetch.post(api.deleteGameSetting, {
    body: stringify(params),
  });
}
