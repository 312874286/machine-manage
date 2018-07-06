import { getSystemDeptList } from '../../services/authorityManage/department';

export default {
  namespace: 'department',
  state: {
    list: [],
    page: {},
  },

  effects: {
    *getSystemDeptList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemDeptList, { restParams });
      yield put({
        type: 'getSystemDeptListBack',
        payload: response,
      });
    },
  },

  reducers: {
    getSystemDeptListBack(state, { payload: { data, page } }) {
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
