import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';



export async function getPointSettingList({ restParams }) {
  return fetch.get(api.getPointSettingLists, {
    restParams,
  });
}

export async function tagList({ restParams }) {
  return fetch.get(api.tagList, {
    restParams,
  });
}


