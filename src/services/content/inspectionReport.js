import { stringify } from 'qs';
import fetch from '../../utils/fetch';
import api from './api';

export async function list({ restParams }) {
  return fetch.get(api.getInspectionReports, {
    restParams,
  });
}
export async function detail({ restParams }) {
  return fetch.get(api.getInspectionReport, {
    restParams,
  });
}
export async function update({ params }) {
  return fetch.post(api.postInspectionReports, {
    body: stringify(params),
  });
}
export async function approve({ params }) {
  return fetch.get(api.ApproveDianInspectionReports, {
    body: stringify(params),
  });
}
export async function retrieve({ params }) {
  return fetch.get(api.getDianInspectionReport, {
    body: stringify(params),
  });
}
export async function updateRemark({ params }) {
  return fetch.get(api.postInspectionReportRemark, {
    body: stringify(params),
  });
}
