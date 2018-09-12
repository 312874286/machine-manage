import fetch from '../../utils/fetch/index';
import api from './api';

export async function templateDelete({ restParams }) {
  return fetch.get(api.templateDelete, {
    restParams,
  });
}

export async function templateInsert({ params }) {
  return fetch.postJSON(api.templateInsert, {
    body: JSON.stringify(params),
  });
}
export async function templateUpdate({ params }) {
  return fetch.postJSON(api.templateUpdate, {
    body: JSON.stringify(params),
  });
}

export async function templateQuery({ restParams }) {
  return fetch.get(api.templateQuery, {
    restParams,
  });
}

export async function templateList({ restParams }) {
  return fetch.get(api.templateList, {
    restParams,
  });
}

export async function getActivityList({ restParams }) {
  return fetch.get(api.getActivityList, {
    restParams,
  });
}

export async function templateExecute({ restParams }) {
  window.location.href = `${api.templateExecute}?name=${restParams.name}&activityCode=${restParams.activityCode}&startTime=${restParams.startTime}&endTime=${restParams.endTime}`;
}
