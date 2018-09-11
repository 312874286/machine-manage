import { getSystemFunctionList } from '../../services/authorityManage/jurisdiction';

export default {
  namespace: 'jurisdiction',
  state: {
    list: [],
    page: {},
    totalNo: 0,
    unColumn: []
  },

  effects: {
    *getSystemFunctionList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getSystemFunctionList, { restParams });
      yield put({
        type: 'getSystemFunctionListBack',
        payload: response,
      });
    },
  },

  reducers: {
    getSystemFunctionListBack(state, { payload: { data, page, unColumn } }) {
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
