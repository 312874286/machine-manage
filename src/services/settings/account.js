import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function saveUser({ params, restParams }) {
  return fetch.put(api.saveUser, {
    restParams,
    body: JSON.stringify(params),
  });
}

export async function setUserStatus({ params, restParams }) {
  return fetch.put(api.setUserStatus, {
    restParams,
    body: JSON.stringify(params),
  });
}

export async function getUsers({ restParams }) {
  return fetch.get(api.getUsers, {
    restParams,
  });
}

export async function createUser({ params, restParams }) {
  return fetch.postJSON(api.createUser, {
    restParams,
    body: JSON.stringify(params),
  });
}

export async function setUserRoles({ params, restParams }) {
  return fetch.post(api.userRoles, {
    restParams,
    body: stringify(params),
  });
}

export async function getUserRoles({ restParams }) {
  return fetch.get(api.userRoles, {
    restParams,
  });
}

export async function getRoles({ restParams }) {
  return fetch.get(api.roles, {
    restParams,
  });
}

export async function getRole({ restParams }) {
  return fetch.get(api.role, {
    restParams,
  });
}

export async function postRole({ params, restParams }) {
  return fetch.postJSON(api.roles, {
    restParams,
    body: JSON.stringify(params),
  });
}

export async function putRole({ params, restParams }) {
  return fetch.put(api.role, {
    restParams,
    body: JSON.stringify(params),
  });
}

export async function delRole({ restParams }) {
  return fetch.delete(api.role, {
    restParams,
  });
}


export async function getRoleFunctions({ restParams }) {
  return fetch.get(api.roleFunctions, {
    restParams,
  });
}
