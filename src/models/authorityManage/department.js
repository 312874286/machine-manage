import { getSystemDeptList } from '../../services/authorityManage/department';

export default {
  namespace: 'department',
  state: {
    list: [],
    page: {},
    totalNo: 0,
    unColumn: []
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
    getSystemDeptListBack(state, { payload: { data, page, unColumn } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
        totalNo: Math.ceil(page.totalCount/page.pageSize),
        unColumn,
      };
    },
  },
};
