import fetch from '../../utils/fetch/index';
import api from './api';
import {stringify} from "qs";

export async function getReportActivity({ restParams }) {
  if (restParams.outputType === 0) {
    window.location.href = `${api.getReportActivityExcel}?activityId=${restParams.activityId}&goodsId=${restParams.goodsId}&merchantId=${restParams.merchantId}&city=${restParams.city}&startTime=${restParams.startTime}&endTime=${restParams.endTime}&outputType=${restParams.outputType}`;
  } else {
    return fetch.get(api.getReportActivity, {
      restParams,
    });
  }
}

export async function getActivitySearchParams({ params }) {
  return fetch.post(api.getActivitySearchParams, {
    body: stringify(params),
  });
}


