import { getCheckFaultList, getCheckFaultDetail, getCheckFaultAnswer, getMachineUserList, saveCheckFault } from '../../services/polling/troubleBill';

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
    *getMachineUserList({ payload: { restParams } }, { call }) {
      const response = yield call(getMachineUserList, { restParams });
      return response.data;
    },
    *saveCheckFault({ payload: { params } }, { call }) {
      const response = yield call(getMachineUserList, { params });
      return response.data;
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
