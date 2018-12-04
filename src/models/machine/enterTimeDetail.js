import { machineLocaleDetailList, machineLocaleDetail } from '../../services/machine/enterTimeDetail';

export default {
  namespace: 'enterTimeDetail',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *machineLocaleDetailList({ payload: { restParams } }, { call, put }) {
      const response = yield call(machineLocaleDetailList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },

    *machineLocaleDetail({ payload: { restParams } }, { call }) {
      const response = yield call(machineLocaleDetail, { restParams });
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

