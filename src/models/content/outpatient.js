import {
  getOutpatientList,
  getOutpatientDetail,
  cancelOrder,
  saveTransferReason,
} from '../../services/content/outpatient';

export default {
  namespace: 'outpatient',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getOutpatientList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getOutpatientList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getOutpatientDetail({ payload: { restParams } }, { call, put }) {
      const response = yield call(getOutpatientDetail, { restParams });
      return response;
    },
    *cancelOrder({ payload: { params, restParams } }, { call, put }) {
      const response = yield call(cancelOrder, { params, restParams });
      return response;
    },
    *saveTransferReason({ payload: { params } }, { call }) {
      const response = yield call(saveTransferReason, { params });
      return response;
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
