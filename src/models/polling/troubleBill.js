import { getCheckFaultList, getCheckFaultDetail, getCheckFaultAnswer } from '../../services/polling/troubleBill';

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
    *getCheckFaultDetail({ payload: { params } }, { call, put }) {
      const response = yield call(getCheckFaultDetail, { params });
      return response;
    },
    *getCheckFaultAnswer({ payload: { params } }, { call, put }) {
      const response = yield call(getCheckFaultAnswer, { params });
      return response;
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
