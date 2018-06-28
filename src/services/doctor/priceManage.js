import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getPriceManageList({ restParams }) {
  return fetch.get(api.getPriceManageList, { restParams });
}

export async function getDoctors({ restParams }) {
  return fetch.get(api.getDoctors, { restParams });
}

export async function getOutpatientTimes({ restParams }) {
  return fetch.get(api.getOutpatientTimes, { restParams });
}

export async function postDoctorPrice({ restParams, params }) {
  return fetch.postJSON(api.postDoctorPrice, {
    restParams,
    body: JSON.stringify(params),
  });
}

export async function getDoctorPrice({ restParams }) {
  return fetch.get(api.getDoctorPrice, {
    restParams,
  });
}
