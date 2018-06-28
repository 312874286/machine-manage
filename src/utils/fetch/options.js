import { getToken } from '../../utils/authority';

export const headers = {
  Accept: {
    JSON: 'application/json, */*',
  },
  ContentType: {
    JSON: 'application/json; charset=utf-8',
    Form: 'application/x-www-form-urlencoded; charset=utf-8',
    FormData: 'multipart/form-data;',
    XML: ' text/xml',
  },
  Token: { 'lf-None-Matoh': getToken() },
};

export const methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  PATCH: 'PATCH',
};

export default {
  headers,
  methods,
};
