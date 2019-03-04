import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

//downloadCheckFault
export async function downloadCheckFault({ params }) {
  console.log('params', params)
  window.location.href = `${api.downloadCheckFault}?type=${params.type}&startTime=${params.startTime}&endTime=${params.endTime}&keyword=${params.keyword}&status=${params.status}&pageNo=${params.pageNo}&source=${params.source}`;
}

export async function getCheckFaultList({ params }) {
  return fetch.post(api.getCheckFaultList, {
    body: stringify(params),
  });
}

export async function getCheckFaultDetail({ params }) {
  return fetch.post(api.getCheckFaultDetail, {
    body: stringify(params),
  });
}

export async function getCheckFaultAnswer({ params }) {
  return fetch.post(api.getCheckFaultAnswer, {
    body: stringify(params),
  });
}

export async function getMachineUserList({ restParams }) {
  return fetch.get(api.getMachineUserList, {
    restParams,
  });
}

export async function saveCheckFault({ params }) {
  return fetch.post(api.saveCheckFault, {
    body: stringify(params),
  });
}

export async function updateCheckStatus({ params }) {
  return fetch.post(api.updateCheckStatus, {
    body: stringify(params),
  });
}
