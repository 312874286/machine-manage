import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getSystemRoleList({ params, restParams }) {
  return fetch.get(api.getSystemRoleList, {
    restParams,
  });
}

export async function getSystemFunctionAll({ params }) {
  return fetch.get(api.getSystemFunctionAll, {
  });
}

export async function getSystemRoleAdd({ params, restParams }) {
  return fetch.get(api.getSystemRoleAdd, {
    restParams,
  });
}

export async function getSystemRoleUpdate({ params, restParams }) {
  return fetch.get(api.getSystemRoleUpdate, {
    restParams,
  });
}

export async function getSystemRoleDelete({ params, restParams }) {
  return fetch.get(api.getSystemRoleDelete, {
    restParams,
  });
}


// export async function getMachineSettingList({ params, restParams }) {
//   return fetch.get(api.getMachineSettingList, {
//     restParams,
//   });
// }
