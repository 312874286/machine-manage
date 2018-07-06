import { getSystemRoleList, getSystemFunctionAll } from '../../services/authorityManage/account';

export default {
  namespace: 'account',
  state: {
    list: [],
    page: {},
  },

  effects: {
    *getSystemRoleList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemRoleList, { restParams });
      yield put({
        type: 'getSystemRoleListBack',
        payload: response,
      });
    },
    *getSystemFunctionAll({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemFunctionAll, { restParams });
      return response;
    },
  },

  reducers: {
    getSystemRoleListBack(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
      };
    },
  },
};
