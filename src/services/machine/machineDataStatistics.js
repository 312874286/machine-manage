import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import apiData from './apiData';


export async function machineStatisticsList({ restParams }) {
  return fetch.get(apiData.machineDataStatistic, {
    restParams,
  });
}



