import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveMerchant({ params }) {
  return fetch.post(api.saveMerchant, {
    body: stringify(params),
  });
}

export async function getMerchantList({ params, restParams }) {
  return fetch.get(api.getMerchantList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function getMerchantDetail({ restParams }) {
  return fetch.get(api.getMerchantDetail, {
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


