import { AccountLogin, ResetPassword, DoResetPassword, DDAccountLogin } from '../../services/user/login';
import { setLogin, setLogout } from '../../utils/authority';
import environment from '../../environments/environment';

const { frontHost } = environment;

export default {
  namespace: 'login',

  state: {
    status: undefined,
    user: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(AccountLogDDAccountLoginin, payload);
      yield put({
        type: 'loginReducer',
        payload: response,
      });
      if (response.code === 0) {
        setLogin(response.data);
        // window.location.reload();
        window.location.replace(frontHost);
        // window.location.href = frontHost;
      }
    },
    *ddlogin({ payload }, { call, put }) {
      const response = yield call(DDAccountLogin, payload);
      yield put({
        type: 'loginReducer',
        payload: response,
      });
      console.log(response);
      if (response.code === 0) {
        setLogin(response.data);
        // window.location.reload();
      }
      window.location.replace(frontHost);
    },
    *logout(_, { put, select }) {
      // TODO
      try {
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        setLogout();
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        window.location.reload();
      }
    },
    *resetPassword({ payload }, { call, put }) {
      const response = yield call(ResetPassword, payload);
      return response;
    },
    *doResetPassword({ payload }, { call, put }) {
      const response = yield call(DoResetPassword, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.code,
        message: payload.msg,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    loginReducer(state, { payload }) {
      return {
        ...state,
        status: payload.code,
        type: 'account',
        message: payload.msg,
      };
    },
    clear(state) {
      return {
        ...state,
        status: payload.code,
        type: 'account',
        message: payload.msg,
      };
    },
  },
};
