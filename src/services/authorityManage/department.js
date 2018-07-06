import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getSystemDeptList({ params, restParams }) {
  return fetch.get(api.getSystemDeptList, {
    restParams,
  });
}

// export async function getMachineSettingList({ params, restParams }) {
//   return fetch.get(api.getMachineSettingList, {
//     restParams,
//   });
// }
