import {
  getRecordList,
  saveRecord,
} from '../../services/customer/record';

export default {
  namespace: 'record',
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
    *saveRecord({ payload: { params } }, { call, put }) {
      const response = yield call(saveRecord, { params });
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
