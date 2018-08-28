import fetch from '../../utils/fetch/index';
import api from './api';
import {stringify} from "qs";

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
export async function findMachineStockoutInfo({ restParams }) {
  return fetch.get(api.findMachineStockoutInfo, {
    restParams,
  });
}

export async function paiTotalList({ restParams }) {
  return fetch.post(api.paiTotalList, {
    restParams,
  });
}

export async function overPlanSetting({ params }) {
  return fetch.post(api.overPlanSetting, {
    body: stringify(params),
  });
}
