import { getTestList } from '../../services/authorityManage/account';

export default {
  namespace: 'account',
  state: {
    dataSource: []
  },

  effects: {
    *getTestList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getTestList, { restParams });
      yield put({
        type: 'getTestListBackData',
        payload: response,
      });
    },
  },

  reducers: {
    getTestListBackData(state, { payload: { data } }) {
      return {
        ...state,
        dataSource: data,
      };
    },
  },
};
