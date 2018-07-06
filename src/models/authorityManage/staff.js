import { getSystemUserList, getSystemRoleAll, getSystemUserAuth } from '../../services/authorityManage/staff';

export default {
  namespace: 'staff',
  state: {
    list: [],
    page: {},
  },

  effects: {
    *getSystemUserList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemUserList, { restParams });
      yield put({
        type: 'getSystemUserListBack',
        payload: response,
      });
    },
    *getSystemRoleAll({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemRoleAll, { restParams });
      return response;
      // yield put({
      //   type: 'getSystemRoleAllBack',
      //   payload: response,
      // });
    },
    *getSystemUserAuth({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemUserAuth, { restParams });
      return response;
      // yield put({
      //   type: 'getSystemRoleAllBack',
      //   payload: response,
      // });
    },
  },

  reducers: {
    getSystemUserListBack(state, { payload: { data, page } }) {
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
