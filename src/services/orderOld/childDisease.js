import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function orders({ restParams }) {
  return fetch.get(api.getChildDiseaseOrders, {
    restParams,
  });
}

export async function order({ restParams }) {
  return fetch.get(api.getChildDiseaseOrder, {
    restParams,
  });
}

export async function cancelOrder({ params }) {
  return fetch.post(api.cancelChildDiseaseOrder, {
    body: stringify(params),
  });
}

export async function updateOrder({ params }) {
  return fetch.post(api.updateChildDiseaseOrder, {
    body: stringify(params),
  });
}
