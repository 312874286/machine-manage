import { stringify } from 'qs';
import fetch from '../../utils/fetch/index';
import api from './api';

export async function goodsTypeLists({ restParams }) {
  return fetch.get(api.goodsTypeLists, {
    restParams,
  });
}

export async function addGoodsType({ params }) {
  return fetch.post(api.addGoodsType, {
    body: stringify(params)
  });
}

export async function editGoodsType({ params }) {
  return fetch.post(api.editGoodsType, {
     body: stringify(params)
  });
}
