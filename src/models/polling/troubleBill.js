import { getCheckFaultList, getCheckFaultDetail, getCheckFaultAnswer, getMachineUserList, saveCheckFault, updateCheckStatus} from '../../services/polling/troubleBill';

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
      const response = yield call(saveCheckFault, { params });
      return response;
    },
    *updateCheckStatus({ payload: { params } }, { call }) {
      const response = yield call(updateCheckStatus, { params });
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
