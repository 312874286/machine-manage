import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getContracts({ restParams }) {
  return fetch.get(api.getContracts, {
    restParams,
  });
}

export async function getContract({ restParams }) {
  return fetch.get(api.getContract, {
    restParams,
  });
}


export async function getContractPrintInfo({ restParams }) {
  return fetch.get(api.getContractPrintInfo, {
    restParams,
  });
}
