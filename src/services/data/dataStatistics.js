import fetch from '../../utils/fetch/index';
import api from './api';

export async function templateDelete({ restParams }) {
  return fetch.postJSON(api.templateDelete, {
    body: JSON.stringify(restParams),
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
  return fetch.postJSON(api.templateQuery, {
    body: JSON.stringify(restParams),
  });
}

export async function templateList({ restParams }) {
  return fetch.postJSON(api.templateList, {
    body: JSON.stringify(restParams),
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

export async function getUserInfo() {
  return fetch.get(api.userInfo, {});
}
