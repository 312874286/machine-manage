import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getList({ restParams }) {
  return fetch.get(api.getDocotors, { restParams });
}

export async function getItem({ restParams }) {
  return fetch.get(api.getDocotor, { restParams });
}

export async function postItem({ params }) {
  return fetch.post(api.postDoctor, { body: stringify(params) });
}

export async function updateItemStatus({ restParams }) {
  return fetch.postJSON(api.updateDocotorStatus, { restParams });
}

export async function upload({ params }) {
  const file = new FormData();
  file.append('file', params.file);
  return fetch.postFile(api.uploadFile, { body: file });
}

export async function getConfig() {
  return fetch.get(api.getDoctorConfig);
}

export async function getScheduleDoctors({ restParams }) {
  return fetch.get(api.getScheduleDoctors, { restParams });
}

export async function getSchedules({ restParams }) {
  return fetch.get(api.getSchedules, { restParams });
}

export async function getSchedulesByDate({ restParams }) {
  return fetch.get(api.getSchedulesByDate, { restParams });
}

export async function getScheduleTimespans({ restParams }) {
  return fetch.get(api.getScheduleTimespans, { restParams });
}

export async function postSchedule({ restParams, params }) {
  return fetch.postJSON(api.postSchedule, {
    restParams,
    body: JSON.stringify(params),
  });
}
