import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getAccountSystemUserList({ params, restParams }) {
  return fetch.get(api.getAccountSystemUserList, {
    restParams,
  });
}

export async function getSystemRoleList({ params, restParams }) {
  return fetch.get(api.getSystemRoleList, {
    restParams,
  });
}

export async function getSystemFunctionAll({ params }) {
  return fetch.get(api.getSystemFunctionAll, {
  });
}


// export async function getMachineSettingList({ params, restParams }) {
//   return fetch.get(api.getMachineSettingList, {
//     restParams,
//   });
// }
