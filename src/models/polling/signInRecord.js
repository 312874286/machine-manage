import { getRecordList } from '../../services/polling/SignInRecord';

export default {
  namespace: 'signInRecord',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getRecordList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getRecordList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, { payload: { data, page } }) {
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
