import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';


export async function getQuestionList({ restParams }) {
  return fetch.get(api.getQuestionList, {
    restParams,
  });
}

export async function getQuestionDetail({ restParams }) {
  return fetch.get(api.getQuestionDetail, {
    restParams,
  });
}
