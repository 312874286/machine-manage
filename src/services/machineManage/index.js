import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function saveMachine({ params }) {
  return fetch.post(api.saveMachine, {
    body: stringify(params),
  });
}

export async function getMachineList({ params, restParams }) {
  return fetch.get(api.getMachineList, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function editMachine({ params }) {
  return fetch.post(api.updateMachine, {
    body: stringify(params),
  });
}

export async function delMachine({ params }) {
  return fetch.post(api.deleteMachine, {
    body: stringify(params),
  });
}
