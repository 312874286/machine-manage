import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getOutpatientList({ restParams }) {
  return fetch.get(api.getOutpatientList, {
    restParams,
  });
}

export async function getOutpatientDetail({ restParams }) {
  return fetch.get(api.getOutpatientDetail, {
    restParams,
  });
}

export async function cancelOrder({ params, restParams }) {
  return fetch.post(api.cancelOrder, {
    restParams,
    body: stringify(params),
  });
}

export async function saveTransferReason({ params }) {
  return fetch.post(api.putTransferReason, {
    body: stringify(params),
  });
}

