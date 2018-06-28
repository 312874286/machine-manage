import {
  getLogList,
} from '../../services/log';

export default {
  namespace: 'log',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getLogList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getLogList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
      return response;
    },
  },

  reducers: {
    saveList(state, { payload: { data, page } }) {
      return {
        ...state,
        logList: data,
        logPage: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
      };
    },
  },
};
