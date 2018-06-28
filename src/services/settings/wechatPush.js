import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getWechatPushList({ restParams }) {
  return fetch.get(api.getWechatPushList, { restParams });
}

export async function setWechatItem({ params, restParams }) {
  return fetch.put(api.setWechatItem,
    {
      body: JSON.stringify(params),
      restParams,
    });
}
