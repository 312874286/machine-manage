import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';
import apiData from './apiData';

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

export async function getMerchantsList({ params }) {
  return fetch.post(api.getMerchantsList, {
    body: stringify(params),
  });
}

export async function getMerchantShops({ restParams }) {
  return fetch.get(api.getMerchantShops, {
    restParams,
  });
}

// export async function getMerchantShops2({ params }) {
//   return fetch.get(api.getMerchantsList, {
//     body: stringify(params),
//   });
// }

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

export async function paiActivity({ params }) {
  return fetch.postJSON(api.paiActivity, {
    body: JSON.stringify(params),
  });
}

export async function getOrderStatistics({ params }) {
  return fetch.postJSON(apiData.machineStatistic, {
    body: JSON.stringify(params),
  });
}

export async function getGoodsStatistics({ params }) {
  return fetch.postJSON(apiData.machineStatistic, {
    body: JSON.stringify(params),
  });
}

export async function activityExcel({ restParams }) {
  window.location.href = `${api.activityExcel}?activityId=${restParams.activityId}&activityType=${restParams.activityType}`;
}
