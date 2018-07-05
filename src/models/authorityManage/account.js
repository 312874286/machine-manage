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
        type: 'getTestList',
        payload: response,
      });
    },
  },

  reducers: {
    getTestList(state, { payload: { data } }) {
      return {
        ...state,
        dataSource: data,
      };
    },
  },
};
