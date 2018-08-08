import fetch from '../../utils/fetch/index';
import api from './api';

export async function findMachinePortalData({ params, restParams }) {
  return fetch.get(api.findMachinePortalData, {
    body: JSON.stringify(params),
    restParams,
  });
}

export async function findExceptionMachine({ restParams }) {
  return fetch.get(api.findExceptionMachine, {
    restParams,
  });
}
