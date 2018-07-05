import { stringify } from 'qs';
import request from '../../utils/fetch';
import api from './api';

export async function AccountLogin(params) {
  return request.post(api.login, {
    body: stringify(params),
  });
}


export async function DDAccountLogin(params) {
  return request.post(api.ddlogin, {
    body: stringify(params),
  });
}

export async function ResetPassword(params) {
  return request.post(api.resetPassword, {
    body: stringify(params),
  });
}

export async function DoResetPassword(params) {
  return request.post(api.doResetPassword, {
    body: stringify(params),
  });
}
