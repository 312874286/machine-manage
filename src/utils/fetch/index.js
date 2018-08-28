import api from 'dva/fetch';
import { routerRedux } from 'dva/router';
import { notification, Modal } from 'antd';
import { headers, methods } from './options';
import store from '../../index';
import { getToken } from '../authority';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

function handleStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: '服务异常',
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

function handlehandleCostumStatus(response) {
  const { dispatch } = store;
  // 校验返回值Code;
  return response.clone().json().then((resp) => {
    // console.log('resp', resp)
    if (resp.code === 999) {
      notification.error({
        message: '登录超时',
        description: resp.msg,
      });
      setTimeout(() => {
        // 登录超时
        dispatch({
          type: 'login/logout',
        });
      }, 1000);
      return;
    }
    if (resp.code === 888) {
      notification.error({
        message: '登录异常',
        description: resp.msg,
      });
      // 登录超时
      dispatch({
        type: 'login/logout',
      });
      return;
    }
    if (resp.code === 0) {
      // 成功请求
      return response.json();
    } else if (resp.code === 10) {
      return response.json();
    } else if (resp.list) {
      return response.json();
    } else {
      // notification.error({
      //   message: '请求错误',
      //   description: resp.msg,
      // });
      Modal.error({
        title: '请求错误',
        content: resp.msg,
      });
      return response.json();
    }
  });
}

function handleException(e) {
  const { dispatch } = store;
  if (e.name === 401) {
    dispatch({
      type: 'login/logout',
    });
    return;
  }
  if (e.name === 403) {
    dispatch(routerRedux.push('/exception/403'));
    return;
  }
  if (e.name <= 504 && e.name >= 500) {
    dispatch(routerRedux.push('/exception/500'));
    return;
  }
  if (e.name >= 404 && e.name < 422) {
    dispatch(routerRedux.push('/exception/404'));
  }
}

function fetch(fetchUrl, fetchOptions) {
  let url = fetchUrl;
  const opts = {
    method: methods.POST,
    headers: {
      Accept: headers.Accept.JSON,
      ...headers.Token,
    },
    ...fetchOptions,
  };
  opts.headers['lf-None-Matoh'] = getToken();
  // rest api support
  if (Object.prototype.hasOwnProperty.call(opts, 'restParams')) {
    const { restParams } = opts;
    if (restParams) {
      const { queryString } = restParams;
      delete opts.restParams;
      for (const key in restParams) {
        if (Object.prototype.hasOwnProperty.call(restParams, key)) {
          url = url.replace(new RegExp(`{${key}}`), restParams[key]);
        }
      }
      if (queryString && Object.keys(queryString).length > 0) {
        const qs = Object.keys(queryString).map((key) => { return `${key}=${queryString[key]}`; }).join('&');
        url += `?${qs}`;
      }
    }
  }
  return api(url, opts)
    .then(handleStatus)
    .then(handlehandleCostumStatus)
    .catch(handleException);
}

fetch.get = (url, options) => {
  const opts = {
    method: methods.GET,
    ...options,
  };
  return fetch(url, opts);
};
fetch.put = (url, options) => {
  const opts = {
    method: methods.PUT,
    headers: {
      'Content-Type': headers.ContentType.JSON,
      ...headers.Token,
    },
    ...options,
  };
  return fetch(url, opts);
};
fetch.delete = (url, options) => {
  const opts = {
    method: methods.DELETE,
    ...options,
  };
  return fetch(url, opts);
};
fetch.post = (url, options) => {
  const opts = {
    method: methods.POST,
    headers: {
      'Content-Type': headers.ContentType.Form,
    },
    ...options,
  };
  return fetch(url, opts);
};
fetch.postFile = (url, options) => {
  const opts = {
    method: methods.POST,
    // 上传文件时不能指定content-type，否则会报错
    // headers: {
    //   'Content-Type': headers.ContentType.FormData,
    // },
    ...options,
  };
  return fetch(url, opts);
};
fetch.postJSON = (url, options) => {
  const opts = {
    method: methods.POST,
    headers: {
      'Content-Type': headers.ContentType.JSON,
    },
    ...options,
  };
  return fetch(url, opts);
};

export default fetch;
