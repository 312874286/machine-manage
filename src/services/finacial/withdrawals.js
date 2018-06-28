
import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getList({ restParams }) {
  return fetch.get(api.getWithdrawalList, { restParams });
}

export async function getDoctorIncomeList({ restParams }) {
  return fetch.get(api.getDoctorIncomeList, { restParams });
}

export async function getDoctorDepositList({ restParams }) {
  return fetch.get(api.getDoctorDepositList, { restParams });
}

export async function getDoctorIncomeInfo({ restParams }) {
  return fetch.get(api.getDoctorIncomeInfo, { restParams });
}

export async function getWithdrawalAuditStatistics({ restParams }) {
  return fetch.get(api.getWithdrawalAuditStatistics, { restParams });
}

export async function updateWithdrawalStatus({ restParams, params }) {
  return fetch.post(api.updateWithdrawalStatus, {
    restParams,
    body: stringify(params),
  });
}
