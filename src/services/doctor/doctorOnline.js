import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getOnlineDoctorList({ restParams }) {
  return fetch.get(api.getOnlineDoctorList, { restParams });
}

export async function setDoctorOffline({ restParams, params }) {
  return fetch.post(api.setDoctorOffline, {
    restParams,
    body: stringify(params),
  });
}

export async function setDoctorUnlock({ restParams, params }) {
  return fetch.post(api.setDoctorUnlock, {
    restParams,
    body: stringify(params),
  });
}
