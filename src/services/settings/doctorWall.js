import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getDoctorWall({ restParams }) {
  return fetch.get(api.getDoctorWallList, { restParams });
}

export async function setWechatItem({ params, restParams }) {
  return fetch.put(api.setWechatItem,
    {
      body: JSON.stringify(params),
      restParams,
    });
}

export async function getDoctorList({ restParams }) {
  return fetch.get(api.getDoctorList, { restParams });
}


export async function deleteSubject({ restParams }) {
  return fetch.delete(api.subject,
    {
      restParams,
    });
}

export async function saveSubject({ params, restParams }) {
  return fetch.put(api.subject,
    {
      restParams,
      body: JSON.stringify(params),
    });
}

export async function createSubject({ params, restParams }) {
  return fetch.postJSON(api.createSubject,
    {
      restParams,
      body: JSON.stringify(params),
    });
}

export async function moveSubject({ params, restParams }) {
  return fetch.postJSON(api.subject,
    {
      restParams,
      body: JSON.stringify(params),
    });
}

export async function getDepartment({ restParams }) {
  return fetch.get(api.getDepartment,
    {
      restParams,
    });
}
