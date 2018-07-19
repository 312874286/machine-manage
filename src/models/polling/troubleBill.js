import { getCheckFaultList } from '../../services/polling/troubleBill';

export default {
  namespace: 'troubleBill',
  state: {
    list: [],
    page: {},
  },

  effects: {
    *getCheckFaultList({ payload: { params } }, { call, put }) {
      const response = yield call(getCheckFaultList, { params });
      yield put({
        type: 'getCheckFaultListBack',
        payload: response,
      });
    },
  },

  reducers: {
    getCheckFaultListBack(state, { payload: { data, page } }) {
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
