import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function saveMachineSetting({ params }) {
  return fetch.post(api.saveMachineSetting, {
    body: stringify(params),
  });
}

export async function getMachineSettingList({ params, restParams }) {
  return fetch.get(api.getMachineSettingList, {
    restParams,
  });
}

export async function editMachineSetting({ params }) {
  return fetch.post(api.updateMachineSetting, {
    body: stringify(params),
  });
}

export async function delMachineSetting({ params }) {
  return fetch.post(api.deleteMachineSetting, {
    body: stringify(params),
  });
}
