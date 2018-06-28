import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getOperationList({ restParams }) {
  return fetch.get(api.getOperationList, {
    restParams,
  });
}

export async function addOrEditGoodsOperation({ params }) {
  return fetch.postJSON(api.addOrEditGoodsOperation, {
    body: JSON.stringify(params),
  });
}

export async function getOperationItemDetail({ restParams }) {
  return fetch.get(api.getOperationItemDetail, {
    restParams,
  });
}

export async function delOperationItem({ params }) {
  return fetch.post(api.delOperationItem, {
    body: stringify(params),
  });
}
