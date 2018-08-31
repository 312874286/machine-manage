import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function updateLocaleMachineSetting({ params }) {
  return fetch.post(api.updateLocaleMachineSetting, {
    body: stringify(params),
  });
}

export async function getMachineSettingList({ params, restParams }) {
  return fetch.get(api.getMachineSettingList, {
    restParams,
  });
}

export async function updateGoodsCountMachineSetting({ params }) {
  return fetch.postJSON(api.updateGoodsCountMachineSetting, {
    body: JSON.stringify(params),
  });
}

export async function deleteChannelMachineSetting({ params }) {
  return fetch.postJSON(api.deleteChannelMachineSetting, {
    body: JSON.stringify(params),
  });
}

export async function getPointSettingList({ restParams }) {
  return fetch.get(api.getPointSettingLists, {
    restParams,
  });
}

export async function getAisleList({ restParams }) {
  return fetch.get(api.getAisleList, {
    restParams,
  });
}

export async function getMachineStatus({ restParams }) {
  return fetch.get(api.getMachineStatus, {
    restParams,
  });
}

export async function getAppStatus({ restParams }) {
  return fetch.get(api.getAppStatus, {
    restParams,
  });
}

export async function cutApp({ restParams }) {
  return fetch.get(api.cutApp, {
    restParams,
  });
}
export async function installApp({ restParams }) {
  return fetch.get(api.installApp, {
    restParams,
  });
}

export async function machineUpdateInfo({ params }) {
  return fetch.post(api.machineUpdateInfo, {
    body: stringify(params),
  });
}
export async function updateMachineCode({ params }) {
  return fetch.post(api.updateMachineCode, {
    body: stringify(params),
  });
}

export async function updateLogStatus({ params }) {
  return fetch.post(api.updateLogStatus, {
    body: stringify(params),
  });
}
