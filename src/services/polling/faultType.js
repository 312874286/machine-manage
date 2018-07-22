import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function getCheckFaultTypeList({ params }) {
//   console.log('getCheckFaultTypeList::22',params);
  return fetch.post(api.getCheckFaultTypeList, {
    body: stringify(params),
  });
}

export async function getCheckFaultTypeAdd({ params }) {
    //   console.log('getCheckFaultTypeList::22',params,stringify(params));
      return fetch.postJSON(api.getCheckFaultTypeAdd, {
        body: stringify(params),
      });
    }
export async function getCheckFaultTypeDetail({ params }) {
    //   console.log('getCheckFaultTypeList::22',params);
      return fetch.post(api.getCheckFaultTypeDetail, {
        body: stringify(params),
      });
    }
export async function getCheckFaultTypeUpdate({ params }) {
    //   console.log('getCheckFaultTypeList::22',params);
      return fetch.postJSON(api.getCheckFaultTypeUpdate, {
        body: stringify(params),
      });
    }
