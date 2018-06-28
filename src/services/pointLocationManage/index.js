import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function savePatient({ params }) {
  return fetch.post(api.savePatient, {
    body: stringify(params),
  });
}

export async function getPatientList({ params, restParams }) {
  return fetch.get(api.getPatientList, {
    body: JSON.stringify(params),
    restParams,
  });
}
