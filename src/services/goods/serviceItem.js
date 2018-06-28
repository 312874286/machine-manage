import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getServiceList({ restParams }) {
  return fetch.get(api.getServiceList, {
    restParams,
  });
}

export async function getServiceItemTags() {
  return fetch.get(api.getServiceItemTags);
}

export async function getDoctorReportDept() {
  return fetch.get(api.getDoctorReportDept);
}

export async function getDoctorGroup() {
  return fetch.get(api.getDoctorGroup);
}

export async function uploadFile({ params, restParams }) {
  const file = new FormData();
  file.append('file', params.file);
  return fetch.postFile(api.uploadFile, { restParams, body: file });
}

export async function addOrUpdateServiceItemBaseInfo({ params }) {
  return fetch.postJSON(api.addOrUpdateServiceItemBaseInfo, {
    body: JSON.stringify(params),
  });
}

export async function getServiceItemDetail({ restParams }) {
  return fetch.get(api.getServiceItemDetail, {
    restParams,
  });
}

export async function updateState({ params }) {
  return fetch.post(api.updateState, {
    body: stringify(params),
  });
}

export async function updateConnect({ params }) {
  return fetch.post(api.updateConnect, {
    body: stringify(params),
  });
}

export async function delServiceItem({ params }) {
  return fetch.post(api.delServiceItem, {
    body: stringify(params),
  });
}

export async function saveDianThirdData({ params }) {
  return fetch.postJSON(api.saveDianThirdData, {
    body: JSON.stringify(params),
  });
}
