import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function saveChannelSetting({ params }) {
  return fetch.post(api.saveChannelSetting, {
    body: stringify(params),
  });
}

export async function getChannelSettingList({ params, restParams }) {
  return fetch.get(api.getChannelSettingList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function editChannelSetting({ params }) {
  return fetch.post(api.updateChannelSetting, {
    body: stringify(params),
  });
}

export async function delChannelSetting({ params }) {
  return fetch.post(api.deleteChannelSetting, {
    body: stringify(params),
  });
}
