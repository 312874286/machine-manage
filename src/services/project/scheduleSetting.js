import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveScheduleSetting({ params }) {
  return fetch.postJSON(api.saveScheduleSetting, {
    body: JSON.stringify(params),
  });
}

export async function getScheduleSettingList({ params, restParams }) {
  return fetch.get(api.getScheduleSettingList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function getScheduleSettingDetail({ restParams }) {
  return fetch.get(api.getScheduleSettingDetail, {
    restParams,
  });
}

export async function getActivityList({ restParams }) {
  return fetch.get(api.getActivityList, {
    restParams,
  });
}

export async function getGameList({ restParams }) {
  return fetch.get(api.getGameList, {
    restParams,
  });
}

export async function editScheduleSetting({ params }) {
  return fetch.postJSON(api.updateScheduleSetting, {
    body: JSON.stringify(params),
  });
}

export async function delScheduleSetting({ params }) {
  return fetch.post(api.deleteScheduleSetting, {
    body: stringify(params),
  });
}

export async function selectAreaMachines({ params }) {
  // return fetch.get(api.selectAreaMachines, {
  //   restParams,
  // });
  return fetch.post(api.selectAreaMachines, {
    body: stringify(params),
  });
}

export async function getPlanMachineDetailList({ restParams }) {
  return fetch.get(api.getPlanMachineDetailList, {
    restParams,
  });
}

export async function getGoodsList({ restParams }) {
  return fetch.get(api.getGoodsList, {
    restParams,
  });
}

export async function getActivityShops({ restParams }) {
  return fetch.get(api.getActivityShops, {
    restParams,
  });
}

// getInteractActivityList
export async function interactLists({ restParams }) {
  return fetch.get(api.interactLists, {
    restParams,
  });
}
