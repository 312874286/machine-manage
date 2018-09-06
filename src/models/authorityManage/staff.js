import { getSystemUserList, getSystemRoleAll, getSystemUserAuth, getSystemUserQueryUserRoles, updateFunctionArea, getFunctionArea } from '../../services/authorityManage/staff';

export default {
  namespace: 'staff',
  state: {
    list: [],
    page: {},
    totalNo: 0
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
    *getSystemUserQueryUserRoles({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemUserQueryUserRoles, { restParams });
      return response;
      // yield put({
      //   type: 'getSystemRoleAllBack',
      //   payload: response,
      // });
    },
    *updateFunctionArea({ payload: { params } }, { call }) {
      const response = yield call(updateFunctionArea, { params });
      return response;
    },
    *getFunctionArea({ payload: { restParams } }, { call }) {
      const response = yield call(getFunctionArea, { restParams });
      return response;
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
        totalNo: Math.ceil(page.totalCount/page.pageSize)
      };
    },
  },
};
