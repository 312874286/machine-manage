import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getSystemUserList({ params, restParams }) {
  return fetch.get(api.getSystemUserList, {
    restParams,
  });
}

export async function getSystemRoleAll({ params }) {
  return fetch.get(api.getSystemRoleAll, {
  });
}

export async function getSystemUserAuth({ params, restParams }) {
  return fetch.get(api.getSystemUserAuth, {
    restParams,
  });
}

export async function getSystemUserQueryUserRoles({ params, restParams }) {
  return fetch.get(api.getSystemUserQueryUserRoles, {
    restParams,
  });
}


