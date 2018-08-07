import fetch from '../../utils/fetch/index';
import api from './api';

export async function getMachinePLanSetting({ params, restParams }) {
  return fetch.get(api.getMachinePLanSetting, {
    body: JSON.stringify(params),
    restParams,
  });
}
