import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveMerchantSetting({ params }) {
  return fetch.post(api.saveMerchantSetting, {
    body: stringify(params),
  });
}

export async function getMerchantSettingList({ params, restParams }) {
  return fetch.get(api.getMerchantSettingList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function getMerchantSettingDetail({ restParams }) {
  return fetch.get(api.getMerchantSettingDetail, {
    restParams,
  });
}

export async function getChannelsList({ restParams }) {
  return fetch.get(api.getChannelList, {
    restParams,
  });
}

export async function editMerchantSetting({ params }) {
  return fetch.post(api.updateMerchantSetting, {
    body: stringify(params),
  });
}

export async function getBaseDict({ params }) {
  return fetch.post(api.getBaseDict, {
    body: stringify(params),
  });
}

export async function alterStatus({ params }) {
  return fetch.post(api.alterStatus, {
    body: stringify(params),
  });
}

export async function resetPwd({ params }) {
  return fetch.post(api.resetPwd, {
    body: stringify(params),
  });
}


