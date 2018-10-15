import { batchList, batchDetail, addBatch, updateBatch } from '../../services/machine/batchSetting';

export default {
  namespace: 'batchSetting',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *batchList({ payload: { params } }, { call, put }) {
      const response = yield call(batchList, { params });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *addBatch({ payload: { params } }, { call }) {
      const response = yield call(addBatch, { params });
      return response;
    },
    *updateBatch({ payload: { params } }, { call }) {
      const response = yield call(updateBatch, { params });
      return response;
    },
    *batchDetail({ payload: { restParams } }, { call }) {
      const response = yield call(batchDetail, { restParams });
      return response;
    },
  },
  reducers: {
    saveList(state, { payload: { data, page, unColumn } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
        unColumn: unColumn
      };
    },
  },
};
