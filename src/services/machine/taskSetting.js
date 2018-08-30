import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function taskAdd({ params }) {
  return fetch.postJSON(api.taskAdd, {
    body: JSON.stringify(params),
  });
}

export async function taskList({ restParams }) {
  return fetch.get(api.taskList, {
    restParams,
  });
}

export async function taskDetail({ params }) {
  return fetch.post(api.taskDetail, {
    body: stringify(params),
  });
}

export async function taskDelete({ params }) {
  return fetch.post(api.taskDelete, {
    body: stringify(params),
  });
}

export async function taskUpdate({ params }) {
  return fetch.postJSON(api.taskUpdate, {
    body: JSON.stringify(params),
  });
}

export async function taskSelectAppList({ params }) {
  return fetch.post(api.taskSelectAppList, {
    body: stringify(params),
  });
}

export async function taskSelectAreaMachines({ params }) {
  return fetch.post(api.taskSelectAreaMachines, {
    body: stringify(params),
  });
}
export async function taskUpdateStatus({ params }) {
  return fetch.post(api.taskUpdateStatus, {
    body: stringify(params),
  });
}
