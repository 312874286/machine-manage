import { machineStatisticsList } from '../../services/machine/machineDataStatistics';

export default {
  namespace: 'machineDataStatistics',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *machineStatisticsList({ payload: { restParams } }, { call, put }) {
      const response = yield call(machineStatisticsList, { restParams });
      // console.log('response', response)
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
  },
  reducers: {
    saveList(state, { payload: { data, page, unColumn } }) {
      return {
        ...state,
        list: data,
        unColumn: unColumn
      };
    },
  },
};
