import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getTestList({ restParams }) {
  console.log('getTestList')
  return fetch.get(api.getTestList, {
    restParams,
  });
}

// export async function getMachineSettingList({ params, restParams }) {
//   return fetch.get(api.getMachineSettingList, {
//     restParams,
//   });
// }
