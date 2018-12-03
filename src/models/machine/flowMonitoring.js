import { flowMonitoring } from '../../services/machine/flowMonitoring';

export default {
  namespace: 'flowMonitoring',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *flowMonitoring({ payload: { restParams } }, { call, put }) {
      const response = yield call(flowMonitoring, { restParams });
      // console.log('response', response)
      yield put({
        type: 'saveList',
        payload: response,
      });
    }
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
