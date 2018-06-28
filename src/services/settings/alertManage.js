import fetch from '../../utils/fetch';
import api from './api';

export async function getAlertManageList({ restParams }) {
  return fetch.get(api.getAlertManageList, {
    restParams,
  });
}
export async function updateAlertManageStatus({ restParams }) {
  return fetch.put(api.updateAlertManageStatus, { restParams });
}
export async function getAlertPersions({ restParams }) {
  return fetch.get(api.getAlertPersions, { restParams });
}
export async function addAlertPersion({ params, restParams }) {
  return fetch.postJSON(api.addAlertPersion, {
    body: JSON.stringify(params),
    restParams,
  });
}
export async function updateAlertPersion({ params, restParams }) {
  return fetch.put(api.updateAlertPersion, {
    body: JSON.stringify(params),
    restParams,
  });
}
export async function updateAlertPersionStatus({ restParams }) {
  return fetch.put(api.updateAlertPersionStatus, { restParams });
}
