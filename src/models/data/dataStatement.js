import { getReportActivity, getActivitySearchParams } from '../../services/data/dataStatement';

export default {
  namespace: 'dataStatement',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getReportActivity({ payload: { restParams } }, { call, put }) {
      const response = yield call(getReportActivity, { restParams });
      if (response) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
    *getActivitySearchParams({ payload: { params } }, { call }) {
      const response = yield call(getActivitySearchParams, { params });
      return response
    },
  },
  reducers: {
    saveList(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data.list,
        totalinfo: data.totalinfo,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
      };
    },
  },
};
