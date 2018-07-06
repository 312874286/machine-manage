import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getSystemFunctionList({ params, restParams }) {
  return fetch.get(api.getSystemFunctionList, {
    restParams,
  });
}

// export async function getMachineSettingList({ params, restParams }) {
//   return fetch.get(api.getMachineSettingList, {
//     restParams,
//   });
// }
