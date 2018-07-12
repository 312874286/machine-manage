import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function saveScheduleSetting({ params }) {
  return fetch.post(api.saveScheduleSetting, {
    body: stringify(params),
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
  return fetch.post(api.updateScheduleSetting, {
    body: stringify(params),
  });
}

export async function delScheduleSetting({ params }) {
  return fetch.post(api.deleteScheduleSetting, {
    body: stringify(params),
  });
}
