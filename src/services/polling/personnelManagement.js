import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getUserList({ restParams }) {
  return fetch.get(api.getUserList, {
    restParams,
  });
}
export async function getUserMachineDetailList({ restParams }) {
  return fetch.get(api.getUserMachineDetailList, {
    restParams,
  });
}
export async function getUserDetail({ restParams }) {
  return fetch.get(api.getUserDetail, {
    restParams,
  });
}
export async function saveUser({ params }) {
  return fetch.postJSON(api.saveUser, {
    body: JSON.stringify(params),
  });
}
export async function updateUser({ params }) {
  return fetch.post(api.updateUser, {
    body: stringify(params),
  });
}
export async function selectMachine({ restParams }) {
  return fetch.get(api.selectMachine, {
    restParams,
  });
}

