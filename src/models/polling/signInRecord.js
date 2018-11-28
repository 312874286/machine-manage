import { getRecordList, userExcel, updateStatus } from '../../services/polling/SignInRecord';

export default {
  namespace: 'signInRecord',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *getRecordList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getRecordList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getUserExcel({ payload: { restParams } }, { call, put }) {
      const response = yield call(userExcel, { restParams });
      return response;
    },
    *setUpdateStatus({ payload: { params } }, { call, put }) {
      const response = yield call(updateStatus, { params });
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
        unColumn,
      };
    },
  },
};
