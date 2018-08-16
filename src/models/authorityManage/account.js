import { getSystemRoleList, getSystemFunctionAll, getSystemRoleAdd, getSystemRoleUpdate, getSystemRoleDelete } from '../../services/authorityManage/account';

export default {
  namespace: 'account',
  state: {
    list: [],
    page: {},
    totalNo: 0
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
    *getSystemRoleAdd({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemRoleAdd, { restParams });
      return response;
    },
    *getSystemRoleUpdate({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemRoleUpdate, { restParams });
      return response;
    },
    *getSystemRoleDelete({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemRoleDelete, { restParams });
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
        totalNo: Math.ceil(page.totalCount/page.pageSize)
      };
    },
  },
};
